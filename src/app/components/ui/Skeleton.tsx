'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  shape?: 'rectangle' | 'circle' | 'rounded';
  animate?: boolean;
  children?: React.ReactNode;
}

export default function Skeleton({
  className = '',
  width = '100%',
  height = '1rem',
  shape = 'rectangle',
  animate = true,
  children
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-neutral-800/50 via-neutral-700/50 to-neutral-800/50 bg-[length:200%_100%]';
  const animationClass = animate ? 'animate-pulse bg-animate-shimmer' : '';

  const shapeClasses = {
    rectangle: '',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${animationClass} ${shapeClasses[shape]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
