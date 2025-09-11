'use client';

import { useState, useEffect } from 'react';

interface UserClockProps {
  className?: string;
}

export function UserClock({ className = "text-zinc-400 text-sm" }: UserClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={className}>
      <span className="font-mono">{formatTime(time)}</span>
      <span className="mx-1">•</span>
      <span>{formatDate(time)}</span>
    </div>
  );
}
