import { useEffect, useRef, useCallback } from 'react';

interface UseDiscordPollingOptions {
    apiEndpoint: string;
    userId: string;
    onStatusUpdate: (status: string) => void;
    enabled?: boolean;
    interval?: number;
}

export const useDiscordPolling = ({
    apiEndpoint,
    userId,
    onStatusUpdate,
    enabled = true,
    interval = 30000
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
            }
        } catch (error) {
            console.warn('Failed to poll Discord status:', error);
        }
    }, [apiEndpoint, userId, onStatusUpdate, enabled]);

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
