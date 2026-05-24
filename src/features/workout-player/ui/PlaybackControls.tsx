import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  /** True when showing a rest item — shows "Skip" instead of play/pause */
  isRest?: boolean;
  canSkipBack: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
}

const ICON_BUTTON =
  'flex items-center justify-center rounded-full transition-colors';

/**
 * PlaybackControls
 *
 * Transport bar: skip-back, play/pause (or skip during rest), skip-forward.
 * iOS HIG touch targets (44px min). Uses design tokens for motion.
 */
const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  isRest = false,
  canSkipBack,
  onPlayPause,
  onSkipForward,
  onSkipBack,
}) => {
  return (
    <div className="flex items-center justify-center gap-8">
      {/* Skip Back */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onSkipBack}
        disabled={!canSkipBack}
        className={ICON_BUTTON}
        style={{
          width: 'var(--touch-target-min)',
          height: 'var(--touch-target-min)',
          opacity: canSkipBack ? 1 : 0.25,
          transitionDuration: 'var(--motion-natural)',
        }}
        aria-label="Previous"
      >
        <SkipBack
          className="w-5 h-5"
          style={{ color: 'var(--text-secondary-color)' }}
        />
      </motion.button>

      {/* Center button — Play/Pause or Skip Rest */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={isRest ? onSkipForward : onPlayPause}
        className={`${ICON_BUTTON} shadow-lg`}
        style={{
          width: 64,
          height: 64,
          backgroundColor: isRest
            ? 'rgba(255, 255, 255, 0.10)'
            : 'rgb(var(--core-teal))',
          transitionDuration: 'var(--motion-natural)',
        }}
        aria-label={isRest ? 'Skip rest' : isPlaying ? 'Pause' : 'Play'}
      >
        {isRest ? (
          <SkipForward className="w-6 h-6" style={{ color: 'rgb(var(--core-white))' }} />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" style={{ color: 'rgb(0, 0, 0)' }} />
        ) : (
          <Play className="w-6 h-6 ml-0.5" style={{ color: 'rgb(0, 0, 0)' }} />
        )}
      </motion.button>

      {/* Skip Forward */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onSkipForward}
        className={ICON_BUTTON}
        style={{
          width: 'var(--touch-target-min)',
          height: 'var(--touch-target-min)',
          transitionDuration: 'var(--motion-natural)',
        }}
        aria-label="Next"
      >
        <SkipForward
          className="w-5 h-5"
          style={{ color: 'var(--text-secondary-color)' }}
        />
      </motion.button>
    </div>
  );
};

export { PlaybackControls };
