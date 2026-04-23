import React from 'react';
import { cn } from '../lib/utils';

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = '#8b5cf6', // var(--color-brand-purple)
  className,
  label,
  sublabel
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = (safeValue / max) * 100;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center flex-col", className)} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90 absolute"
        width={size}
        height={size}
      >
        <circle
          className="text-ring-base stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500 ease-in-out"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {label && <span className="text-xl font-bold">{label}</span>}
        {sublabel && <span className="text-xs text-text-secondary">{sublabel}</span>}
      </div>
    </div>
  );
}
