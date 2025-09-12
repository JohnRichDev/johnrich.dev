'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Skeleton from '../ui/Skeleton';
import { useDiscordSocket } from '../hooks/useDiscordSocket';
import { useDiscordPolling } from '../hooks/useDiscordPolling';

const StatusIcon = ({ status, size = 18 }: { status: string; size?: number }) => {
    const svgProps = {
        width: size,
        height: size,
        viewBox: "0 0 60 60",
        className: "rounded-full bg-neutral-900 border-3 border-neutral-900 transition-all duration-300 ease-in-out"
    };

    switch (status) {
        case 'online':
            return (
                <svg {...svgProps}>
                    <circle cx="30" cy="30" r="30" fill="#43a259" />
                </svg>
            );
        case 'idle':
            return (
                <svg {...svgProps}>
                    <path d="M0,32.34c14.9,6.08,23.37,5.29,30.9-2.87C38.05,21.71,38.52,12.55,32.42,0C45.88-.34,58.7,13,59.29,27.89a30.13,30.13,0,0,1-28.5,31.2C14.82,59.8.93,47.73,0,32.34Z" fill="#ca9653" />
                </svg>
            );
        case 'dnd':
            return (
                <svg {...svgProps} viewBox="0 0 60 60">
                    <defs>
                        <mask id="cutout">

                            <rect width="100%" height="100%" fill="white" />
                            <rect x="7.5" y="22.5" width="45" height="15" rx="7.5" fill="black" />
                        </mask>
                    </defs>


                    <circle cx="30" cy="30" r="30" fill="#d63a42" mask="url(#cutout)" />
                </svg>
            );
        case 'offline':
        case 'invisible':
        default:
            return (
                <svg {...svgProps}>
                    <defs>
                        <mask id="offline-cutout">
                            <rect width="100%" height="100%" fill="white" />
                            <circle cx="30" cy="30" r="15" fill="black" />
                        </mask>
                    </defs>
                    <circle cx="30" cy="30" r="30" fill="#83838b" mask="url(#offline-cutout)" />
                </svg>
            );
    }
};

interface DiscordProfileProps {
    readonly userId?: string;
    readonly apiEndpoint?: string;
    readonly size?: number;
    readonly showStatus?: boolean;
    readonly className?: string;
    readonly connectionMode?: 'websocket' | 'polling';
    readonly pollingInterval?: number;
    readonly onLoadingStateChange?: (isLoading: boolean) => void;
}

const avatarCache = new Map<string, { avatarUrl: string; status: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

function isCacheValid(cached: { avatarUrl: string; status: string; timestamp: number } | undefined, now: number) {
    return !!cached && (now - cached.timestamp) < CACHE_DURATION;
}

export default function DiscordProfile({
    userId = '150471906536062976',
    apiEndpoint = 'https://discord-presence-api.johnrich.dev',
    size = 70,
    showStatus = true,
    className = '',
    connectionMode = 'websocket',
    pollingInterval = 30000,
    onLoadingStateChange
}: DiscordProfileProps) {
    const getCachedAvatarUrl = () => {
        const cached = avatarCache.get(userId);
        const now = Date.now();
        if (isCacheValid(cached, now)) {
            return cached?.avatarUrl ?? '/profile.png';
        }
        return null;
    };

    const getCachedStatus = () => {
        const cached = avatarCache.get(userId);
        const now = Date.now();
        if (isCacheValid(cached, now)) {
            return cached?.status ?? 'offline';
        }
        return 'offline';
    };

    const hasCachedData = useCallback(() => {
        const cached = avatarCache.get(userId);
        const now = Date.now();
        return isCacheValid(cached, now);
    }, [userId]);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(getCachedAvatarUrl());
    const [status, setStatus] = useState(getCachedStatus());
    const [isLoading, setIsLoading] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [showContent, setShowContent] = useState(() => {
        const cached = avatarCache.get(userId);
        const now = Date.now();
        return isCacheValid(cached, now);
    });

    const fetchUserData = useCallback(async (isMountedRef?: { current: boolean }) => {
        const handleSuccess = (data: { avatarUrl?: string; status?: string }) => {
            if (isMountedRef && !isMountedRef.current) return;

            setIsRateLimited(false);

            if (data.avatarUrl) {
                setAvatarUrl(data.avatarUrl);
            }

            if (data.status) {
                setStatus(data.status);
            }

            avatarCache.set(userId, {
                avatarUrl: data.avatarUrl || '/profile.png',
                status: data.status || 'offline',
                timestamp: Date.now()
            });

            setShowContent(true);
            onLoadingStateChange?.(false);
        };

        const handleRateLimit = () => {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Discord API rate limited (429). Using backup profile and hiding status.');
            }

            if (isMountedRef && !isMountedRef.current) return;
            
            setIsRateLimited(true);
            setAvatarUrl('/profile.png');
            setStatus('offline');
            setShowContent(true);
            onLoadingStateChange?.(false);
        };

        const handleError = () => {
            setAvatarUrl('/profile.png');
            setShowContent(true);
            onLoadingStateChange?.(false);
        };

        try {
            const response = await fetch(`${apiEndpoint}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                handleSuccess(data);
            } else if (response.status === 429) {
                handleRateLimit();
            } else {
                handleError();
            }
        } catch {
            handleError();
        } finally {
            if (!isMountedRef || isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [apiEndpoint, userId, onLoadingStateChange]);

    const handleRateLimited = useCallback(() => {
        setIsRateLimited(true);
        setAvatarUrl('/profile.png');
        setStatus('offline');
    }, []);

    const handleStatusUpdate = useCallback((newStatus: string) => {
        if (newStatus && newStatus !== status) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Updating Discord status for user ${userId}:`, status, '->', newStatus);
            }
            setStatus(newStatus);

            const cached = avatarCache.get(userId);
            if (cached) {
                avatarCache.set(userId, {
                    ...cached,
                    status: newStatus,
                    timestamp: Date.now()
                });
            }
        }
    }, [userId, status]);

    useDiscordSocket({
        apiEndpoint,
        userId,
        onStatusUpdate: handleStatusUpdate,
        enabled: showStatus && connectionMode === 'websocket',
        onRateLimited: handleRateLimited
    });

    useDiscordPolling({
        apiEndpoint,
        userId,
        onStatusUpdate: handleStatusUpdate,
        enabled: showStatus && connectionMode === 'polling',
        interval: pollingInterval,
        onRateLimited: handleRateLimited
    });

    useEffect(() => {
        const isMountedRef = { current: true };

        if (hasCachedData()) {
            setShowContent(true);
            onLoadingStateChange?.(false);
        } else {
            onLoadingStateChange?.(true);
        }

        const fallbackTimeout = setTimeout(() => {
            if (isMountedRef.current && !showContent) {
                setShowContent(true);
                onLoadingStateChange?.(false);
            }
        }, 50);

        if (!hasCachedData()) {
            setIsLoading(true);
            fetchUserData(isMountedRef);
        }

        return () => {
            isMountedRef.current = false;
            clearTimeout(fallbackTimeout);
        };
    }, [userId, apiEndpoint, hasCachedData, fetchUserData, onLoadingStateChange, showContent]);

    const shouldShowSkeleton = !showContent && isLoading;
    const shouldRenderImage = showContent && avatarUrl !== null;

    const renderImageContent = () => {
        if (!shouldRenderImage || !avatarUrl) return null;

        return (
            <div className={`relative transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={size}
                    height={size}
                    className={`cursor-pointer select-none rounded-full object-cover border border-neutral-700 transition-all duration-300 ease-in-out ${className}`}
                    priority={hasCachedData()}
                    loading={hasCachedData() ? "eager" : "lazy"}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onError={() => {
                        if (avatarUrl !== '/profile.png') {
                            setAvatarUrl('/profile.png');
                        }
                    }}
                    unoptimized={avatarUrl.startsWith('https://cdn.discordapp.com')}
                />
                {isLoading && hasCachedData() && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        );
    };

    const renderSkeleton = () => (
        <Skeleton
            width={size}
            height={size}
            shape="circle"
            className="border border-neutral-700"
        />
    );

    const renderMainContent = () => {
        if (shouldShowSkeleton) {
            return renderSkeleton();
        }
        
        const imageContent = renderImageContent();
        return imageContent || renderSkeleton();
    };

    return (
        <div className="relative">
            {renderMainContent()}

            {showStatus && !isRateLimited && (
                <div className={`absolute -bottom-0.5 -right-0.5 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="relative transition-all duration-300 ease-in-out">
                        {shouldShowSkeleton ? (
                            <Skeleton
                                width={18}
                                height={18}
                                shape="circle"
                                className="border-2 border-neutral-900"
                            />
                        ) : (
                            <StatusIcon status={status} size={18} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
