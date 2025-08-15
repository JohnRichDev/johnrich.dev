'use client';

import React from 'react';
import Image from 'next/image';
import DiscordProfile from './DiscordProfile';
import { profileConfig } from '../config/ProfileConfig';

interface ProfileProps {
  size?: number;
  className?: string;
  onLoadingStateChange?: (isLoading: boolean) => void;
}

export default function Profile({ size = 70, className = '', onLoadingStateChange }: ProfileProps) {
  React.useEffect(() => {
    if (profileConfig.type === 'static') {
      onLoadingStateChange?.(false);
    }
  }, [onLoadingStateChange]);

  if (profileConfig.type === 'static') {

    return (
      <div className="relative">
        <Image
          src={profileConfig.staticImagePath || '/profile.png'}
          alt="Profile"
          width={size}
          height={size}
          className={`cursor-pointer select-none rounded-full object-cover border border-neutral-700 transition-all duration-300 ease-in-out ${className}`}
          priority
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    );
  }

  if (profileConfig.type === 'discord' && profileConfig.discord) {
    return (
      <DiscordProfile
        userId={profileConfig.discord.userId}
        apiEndpoint={profileConfig.discord.apiEndpoint}
        size={size}
        showStatus={profileConfig.discord.showStatus}
        connectionMode={profileConfig.discord.connectionMode}
        pollingInterval={profileConfig.discord.pollingInterval}
        className={className}
        onLoadingStateChange={onLoadingStateChange}
      />
    );
  }

  return (
    <div className="relative">
      <Image
        src="/profile.png"
        alt="Profile"
        width={size}
        height={size}
        className={`cursor-pointer select-none rounded-full object-cover border border-neutral-700 transition-all duration-300 ease-in-out ${className}`}
        priority
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
}
