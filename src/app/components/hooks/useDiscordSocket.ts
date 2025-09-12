import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseDiscordSocketOptions {
    apiEndpoint: string;
    userId: string;
    onStatusUpdate: (status: string) => void;
    enabled?: boolean;
    onRateLimited?: () => void;
}

let globalSocket: Socket | null = null;
let connectionCount = 0;
const lastKnownStatus: { [userId: string]: string } = {};

export const useDiscordSocket = ({
    apiEndpoint,
    userId,
    onStatusUpdate,
    enabled = true,
    onRateLimited
}: UseDiscordSocketOptions) => {
    const isMountedRef = useRef(true);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cleanupSocket = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        connectionCount--;

        if (connectionCount <= 0 && globalSocket) {
            globalSocket.disconnect();
            globalSocket = null;
            connectionCount = 0;
        }
    }, []);

    const initializeSocket = useCallback(() => {
        if (!enabled || !isMountedRef.current) return;

        if (globalSocket?.connected) {
            connectionCount++;
            globalSocket.emit('subscribe', {
                userId,
                updateTypes: ['status']
            });
            return;
        }

        const shouldResetSocket = globalSocket && !globalSocket.connected;
        if (shouldResetSocket && globalSocket) {
            globalSocket.disconnect();
            globalSocket = null;
        }

        const createNewSocket = () => {
            globalSocket = io(apiEndpoint, {
                timeout: 20000,
                autoConnect: true,
                transports: ['websocket', 'polling'],
                upgrade: true,
                forceNew: false,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                reconnectionDelayMax: 10000,
            });

            connectionCount++;
            setupSocketHandlers();
        };

        const setupSocketHandlers = () => {
            if (!globalSocket) return;

            globalSocket.on('connect', handleConnect);
            globalSocket.on('connect_error', handleConnectError);
            globalSocket.on('disconnect', handleDisconnect);
            globalSocket.on('upgrade', handleUpgrade);
            globalSocket.on('upgradeError', handleUpgradeError);
            globalSocket.on('userUpdate', handleUserUpdate);
        };

        const handleConnect = () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Discord socket connected via:', globalSocket?.io.engine.transport.name);
            }
            if (isMountedRef.current) {
                globalSocket?.emit('subscribe', {
                    userId,
                    updateTypes: ['status']
                });
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Subscribed to Discord status updates for user:', userId);
                }
            }
        };

        const handleConnectError = (error: Error) => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord socket connection error:', error.message);
            }
            const isRateLimit = error.message.includes('429') || error.message.toLowerCase().includes('rate limit');
            if (isRateLimit) {
                onRateLimited?.();
            }
        };

        const handleDisconnect = (reason: string) => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord socket disconnected:', reason);
            }
        };

        const handleUpgrade = () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Discord socket upgraded to:', globalSocket?.io.engine.transport.name);
            }
        };

        const handleUpgradeError = (error: Error) => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord socket upgrade error:', error);
            }
        };

        const handleUserUpdate = (data: { updateType: string; status?: string }) => {
            if (!isMountedRef.current) return;

            if (data.updateType === 'status' && data.status) {
                const previousStatus = lastKnownStatus[userId];
                const hasStatusChanged = previousStatus !== data.status;
                
                if (hasStatusChanged) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`Discord status changed for ${userId}:`, previousStatus, '->', data.status);
                    }
                    lastKnownStatus[userId] = data.status;
                    onStatusUpdate(data.status);
                } else if (process.env.NODE_ENV !== 'production') {
                    console.log(`Discord status update received but unchanged for ${userId}:`, data.status);
                }
            }
        };

        createNewSocket();
    }, [apiEndpoint, userId, onStatusUpdate, enabled, onRateLimited]);

    useEffect(() => {
        isMountedRef.current = true;
        initializeSocket();

        return () => {
            isMountedRef.current = false;
            cleanupSocket();
        };
    }, [initializeSocket, cleanupSocket]);

    return {
        isConnected: globalSocket?.connected ?? false
    };
};
