import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseDiscordSocketOptions {
    apiEndpoint: string;
    userId: string;
    onStatusUpdate: (status: string) => void;
    enabled?: boolean;
}

let globalSocket: Socket | null = null;
let connectionCount = 0;

export const useDiscordSocket = ({
    apiEndpoint,
    userId,
    onStatusUpdate,
    enabled = true
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
            timeout: 15000,
            retries: 3,
            autoConnect: true,
            transports: ['polling'],
            upgrade: true,
            forceNew: false,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        connectionCount++;

        globalSocket.on('connect', () => {
            if (isMountedRef.current) {
                globalSocket?.emit('subscribe', {
                    userId,
                    updateTypes: ['status']
                });
            }
        });

        globalSocket.on('connect_error', (error) => {
            console.warn('Discord socket connection error:', error.message);

            if (isMountedRef.current && reconnectTimeoutRef.current === null) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (globalSocket && isMountedRef.current) {
                        globalSocket.io.opts.transports = ['polling'];
                        globalSocket.connect();
                    }
                    reconnectTimeoutRef.current = null;
                }, 2000);
            }
        });

        globalSocket.on('disconnect', (reason) => {
            console.warn('Discord socket disconnected:', reason);
        });

        globalSocket.on('userUpdate', (data: { updateType: string; status?: string }) => {
            if (!isMountedRef.current) return;

            if (data.updateType === 'status' && data.status) {
                onStatusUpdate(data.status);
            }
        });

    }, [apiEndpoint, userId, onStatusUpdate, enabled]);

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
