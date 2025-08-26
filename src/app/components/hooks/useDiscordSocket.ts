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

        if (globalSocket && globalSocket.connected) {
            connectionCount++;
            globalSocket.emit('subscribe', {
                userId,
                updateTypes: ['status']
            });
            return;
        }

        if (globalSocket && !globalSocket.connected) {
            globalSocket.disconnect();
            globalSocket = null;
        }

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

        globalSocket.on('connect', () => {
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
        });

        globalSocket.on('connect_error', (error) => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord socket connection error:', error.message);
            }
            if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
                onRateLimited?.();
            }
        });

        globalSocket.on('disconnect', (reason) => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord socket disconnected:', reason);
            }
        });

        globalSocket.on('upgrade', () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Discord socket upgraded to:', globalSocket?.io.engine.transport.name);
            }
        });

        globalSocket.on('upgradeError', (error) => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord socket upgrade error:', error);
            }
        });

        globalSocket.on('userUpdate', (data: { updateType: string; status?: string }) => {
            if (!isMountedRef.current) return;

            if (data.updateType === 'status' && data.status) {
                const previousStatus = lastKnownStatus[userId];
                if (previousStatus !== data.status) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`Discord status changed for ${userId}:`, previousStatus, '->', data.status);
                    }
                    lastKnownStatus[userId] = data.status;
                    onStatusUpdate(data.status);
                } else if (process.env.NODE_ENV !== 'production') {
                    console.log(`Discord status update received but unchanged for ${userId}:`, data.status);
                }
            }
        });

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
