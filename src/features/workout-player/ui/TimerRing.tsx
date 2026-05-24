import React from 'react';
import { motion } from 'framer-motion';

interface TimerRingProps {
  /** 0–1, how far through the current item */
  progress: number;
  /** Whether the timer is in the final 3 seconds */
  isFinalCountdown: boolean;
  /** Formatted time string displayed inside the ring */
  timeDisplay: string;
  /** Visual variant: exercise (teal), rest (dim), intro (subtle) */
  variant?: 'exercise' | 'rest' | 'intro';
  /** Ring diameter in px */
  size?: number;
}

const RING_COLORS = {
  exercise: 'rgb(var(--core-teal))',
  rest: 'rgba(255, 255, 255, 0.30)',
  intro: 'rgba(0, 183, 120, 0.40)',
};

const FINAL_COLOR = 'rgb(var(--feedback-error))';
const TRACK_COLOR = 'rgba(255, 255, 255, 0.06)';

/**
 * TimerRing
 *
 * Circular SVG countdown ring with centered timer digits.
 * Uses design tokens for the timer text (--timer-text-size, --timer-text-weight).
 * Smooth animated stroke via framer-motion.
 */
const TimerRing: React.FC<TimerRingProps> = ({
  progress,
  isFinalCountdown,
  timeDisplay,
  variant = 'exercise',
  size = 240,
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const center = size / 2;

  const ringColor = isFinalCountdown ? FINAL_COLOR : RING_COLORS[variant];
  const glowColor = isFinalCountdown
    ? 'rgba(239, 68, 68, 0.25)'
    : variant === 'exercise'
      ? 'rgba(0, 183, 120, 0.15)'
      : 'transparent';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Subtle glow behind the ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          backgroundColor: glowColor,
          filter: 'blur(40px)',
        }}
      />

      {/* SVG ring */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={TRACK_COLOR}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </svg>

      {/* Timer digits — centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--timer-text-size)',
            fontWeight: 'var(--timer-text-weight)',
            letterSpacing: 'var(--tracking-timer)',
            color: isFinalCountdown ? FINAL_COLOR : 'var(--text-primary-color)',
            lineHeight: 1,
          }}
        >
          {timeDisplay}
        </span>
      </div>
    </div>
  );
};

export { TimerRing };
