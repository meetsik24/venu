'use client';
import React from 'react';

interface LumaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LumaLogoSVG({ className = "w-5", size = 'md' }: LumaLogoProps) {
  const sizeClasses = {
    sm: "w-4",
    md: "w-5", 
    lg: "w-6"
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 133 134"
    >
      <path
        fill="currentColor"
        d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67"
      />
    </svg>
  );
}

export function LumaWordmark({ className = "w-20", theme = 'light' }: { className?: string; theme?: 'light' | 'dark' }) {
  return (
    <img
      src={theme === 'light' ? '/Luma/wordmark-dark.png' : '/Luma/wordmark-light.png'}
      alt="EventFlow logo"
      className={className}
    />
  );
}
