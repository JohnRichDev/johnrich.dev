import { useEffect, useRef, useCallback } from 'react';

interface UseDiscordPollingOptions {
    apiEndpoint: string;
    userId: string;
    onStatusUpdate: (status: string) => void;
    enabled?: boolean;
    interval?: number;
    onRateLimited?: () => void;
}

export const useDiscordPolling = ({
    apiEndpoint,
    userId,
    onStatusUpdate,
    enabled = true,
    interval = 30000,
    onRateLimited
}: UseDiscordPollingOptions) => {
    const isMountedRef = useRef(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastStatusRef = useRef<string | null>(null);

    const pollStatus = useCallback(async () => {
        if (!enabled || !isMountedRef.current) return;

        try {
            const response = await fetch(`${apiEndpoint}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok && isMountedRef.current) {
                const data = await response.json();
                if (data.status && data.status !== lastStatusRef.current) {
                    lastStatusRef.current = data.status;
                    onStatusUpdate(data.status);
                }
            } else if (response.status === 429) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('Discord API rate limited during polling (429). Stopping polling temporarily.');
                }   
                onRateLimited?.();
                
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Failed to poll Discord status:', error);
            }
        }
    }, [apiEndpoint, userId, onStatusUpdate, enabled, onRateLimited]);

    useEffect(() => {
        isMountedRef.current = true;

        if (enabled) {
            pollStatus();

            intervalRef.current = setInterval(pollStatus, interval);
        }

        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [pollStatus, interval, enabled]);

    return {
        isPolling: enabled
    };
};
