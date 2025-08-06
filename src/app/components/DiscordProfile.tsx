'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import Skeleton from './Skeleton';

const UPDATE_TYPE_STATUS = 'status';
const UPDATE_TYPE_AVATAR = 'avatar';

interface UserUpdateData {
    updateType: string;
    avatarUrl?: string;
    status?: string;
}

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
                <svg {...svgProps}>
                    <circle cx="30" cy="30" r="30" fill="#d63a42" />
                    <rect x="15" y="22.5" width="30" height="15" rx="7.5" fill="#d63a42" />
                    <rect x="7.5" y="22.5" width="45" height="15" rx="7.5" fill="white" />
                </svg>
            );
        case 'offline':
        case 'invisible':
        default:
            return (
                <svg {...svgProps}>
                    <circle cx="30" cy="30" r="30" fill="#83838b" />
                    <circle cx="30" cy="30" r="15" fill="none" stroke="white" strokeWidth="7.5" />
                </svg>
            );
    }
};

interface DiscordProfileProps {
    userId?: string;
    apiEndpoint?: string;
    size?: number;
    showStatus?: boolean;
    className?: string;
    onLoadingStateChange?: (isLoading: boolean) => void;
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
    onLoadingStateChange
}: DiscordProfileProps) {
    const getCachedAvatarUrl = () => {
        const cached = avatarCache.get(userId);
        const now = Date.now();
        if (isCacheValid(cached, now)) {
            return cached?.avatarUrl ?? '/profile.png';
        }
        return '/profile.png';
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

    const [avatarUrl, setAvatarUrl] = useState(getCachedAvatarUrl());
    const [status, setStatus] = useState(getCachedStatus());
    const [isLoading, setIsLoading] = useState(false);
    const [showContent, setShowContent] = useState(() => {
        const cached = avatarCache.get(userId);
        const now = Date.now();
        return isCacheValid(cached, now);
    });

    const fetchUserData = useCallback(async (isMountedRef?: { current: boolean }) => {
        console.log('Fetching user data from REST API...');
        try {
            const response = await fetch(`${apiEndpoint}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('REST API response:', data);

                if (isMountedRef && !isMountedRef.current) return;

                if (data.avatarUrl) {
                    console.log('Setting avatar URL from REST API:', data.avatarUrl);
                    setAvatarUrl(data.avatarUrl);
                }

                if (data.status) {
                    console.log('Setting status from REST API:', data.status);
                    setStatus(data.status);
                }

                avatarCache.set(userId, {
                    avatarUrl: data.avatarUrl || '/profile.png',
                    status: data.status || 'offline',
                    timestamp: Date.now()
                });

                setShowContent(true);
                onLoadingStateChange?.(false);

            } else {
                console.warn(`API returned ${response.status}: ${response.statusText}`);
                setAvatarUrl('/profile.png');
                setShowContent(true);
                onLoadingStateChange?.(false);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setAvatarUrl('/profile.png');
            setShowContent(true);
            onLoadingStateChange?.(false);
        } finally {
            if (!isMountedRef || isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [apiEndpoint, userId, onLoadingStateChange]);

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
                console.log('Fallback timeout triggered, showing content');
                setShowContent(true);
                onLoadingStateChange?.(false);
            }
        }, 50);

        if (!hasCachedData()) {
            setIsLoading(true);
            fetchUserData(isMountedRef);
        }

        const socket = io(apiEndpoint, {
            timeout: 10000,
            retries: 2,
            autoConnect: true,
            transports: ['polling', 'websocket'],
            upgrade: true,
        });

        socket.on('connect', () => {
            console.log('Connected to Discord presence socket');
            socket.emit('subscribe', {
                userId,
                updateTypes: [UPDATE_TYPE_STATUS]
            });
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from Discord presence socket:', reason);
        });

        socket.on('connect_error', (error) => {
            console.warn('Socket connection error:', error.message);
        });

        socket.on('userUpdate', (data: UserUpdateData) => {
            if (!isMountedRef.current) return;

            if (data.updateType === UPDATE_TYPE_STATUS && data.status && data.status !== status) {
                console.log('Status update received via WebSocket:', data.status);
                setStatus(data.status);

                const cached = avatarCache.get(userId);
                if (cached) {
                    avatarCache.set(userId, {
                        ...cached,
                        status: data.status,
                        timestamp: Date.now()
                    });
                }
            }
        });

        socket.on('error', (error: Error) => {
            console.warn('Socket error (non-critical):', error);
        });

        return () => {
            isMountedRef.current = false;
            socket.disconnect();
            clearTimeout(fallbackTimeout);
        };
    }, [userId, apiEndpoint, avatarUrl, status, hasCachedData, fetchUserData, onLoadingStateChange, showContent]);

    const shouldShowSkeleton = !showContent && isLoading;

    console.log('DiscordProfile render:', {
        showContent,
        isLoading,
        shouldShowSkeleton,
        avatarUrl,
        hasCachedData: hasCachedData()
    });

    return (
        <div className="relative">
            {shouldShowSkeleton ? (
                <Skeleton
                    width={size}
                    height={size}
                    shape="circle"
                    className="border border-neutral-700"
                />
            ) : (
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
                            console.log('Image onError called, falling back to /profile.png');
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
            )}

            {showStatus && (
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
