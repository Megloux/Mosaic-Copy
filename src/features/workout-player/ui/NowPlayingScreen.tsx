import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { usePlayerStore } from '../model/playerStore';
import { TimerRing } from './TimerRing';
import { PlaybackControls } from './PlaybackControls';
import { formatTimer } from '../lib/formatTime';
import { PlaybackItem } from '../model/types';

interface NowPlayingScreenProps {
  onClose: () => void;
}

/**
 * NowPlayingScreen
 *
 * Flat playlist player — exercises and rest only, no block callouts.
 * Spotify-style: content centered, controls at bottom, progress at bottom.
 * iOS-safe: respects safe-area-inset-top/bottom, 44px touch targets.
 */
const NowPlayingScreen: React.FC<NowPlayingScreenProps> = ({ onClose }) => {
  const {
    currentIndex,
    timeRemaining,
    status,
    currentItem,
    upNextItem,
    exerciseProgress,
    overallProgress,
    play,
    pause,
    skipForward,
    skipBack,
    tick,
  } = usePlayerStore();

  const item = currentItem();
  const nextUp = upNextItem();
  const progress = exerciseProgress();
  const overall = overallProgress();

  // Timer interval — lives in React, store is pure synchronous
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [status, tick]);

  if (!item) return null;

  // Timer progress for the ring (1 = full, 0 = empty)
  const timerProgress =
    item.duration > 0 ? 1 - timeRemaining / item.duration : 0;
  const isFinalCountdown = timeRemaining <= 3 && timeRemaining > 0;

  const handlePlayPause = () => {
    if (status === 'playing') pause();
    else play();
  };

  // ── Exercise / Rest View ──────────────────────────────
  const isRest = item.type === 'rest';

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        backgroundColor: 'rgb(var(--core-black))',
        fontFamily: 'var(--font-primary)',
        zIndex: 'var(--layer-overlay)',
      }}
    >
      {/* ── Top bar (iOS safe area) ──────────────────── */}
      <header
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{
          minHeight: 'var(--touch-target-min)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <button
          onClick={onClose}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-white/10 transition-colors"
          style={{ transitionDuration: 'var(--motion-natural)' }}
          aria-label="Close player"
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'rgb(var(--core-white))' }} />
        </button>
        <div style={{ width: 32 }} /> {/* Balance spacer */}
      </header>

      {/* ── Main content ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: [0.24, 1.12, 0.76, 1] }}
            className="flex flex-col items-center w-full"
          >
            {/* Timer ring */}
            <TimerRing
              progress={timerProgress}
              isFinalCountdown={isFinalCountdown}
              timeDisplay={formatTimer(timeRemaining)}
              variant={isRest ? 'rest' : 'exercise'}
            />

            {/* Exercise name */}
            <h2
              className="mt-6 text-center"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--text-primary-weight)',
                color: 'var(--text-primary-color)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {isRest ? 'Rest' : item.label}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Up Next card ───────────────────────────────── */}
      <div className="px-6 mb-4 flex-shrink-0">
        {nextUp ? (
          <UpNextCard item={nextUp} isRest={isRest} />
        ) : (
          <div
            className="rounded-xl py-3 px-4 text-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--text-tertiary-weight)',
                color: 'var(--text-tertiary-color)',
              }}
            >
              Last exercise
            </span>
          </div>
        )}
      </div>

      {/* ── Controls ───────────────────────────────────── */}
      <div className="px-6 mb-3 flex-shrink-0">
        <PlaybackControls
          isPlaying={status === 'playing'}
          isRest={isRest}
          canSkipBack={currentIndex > 0}
          onPlayPause={handlePlayPause}
          onSkipForward={skipForward}
          onSkipBack={skipBack}
        />
      </div>

      {/* ── Progress bar ───────────────────────────────── */}
      <div
        className="px-6 flex-shrink-0"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)' }}
      >
        {/* Bar */}
        <div
          className="w-full rounded-full overflow-hidden mb-2"
          style={{ height: 3, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'rgb(var(--core-teal))' }}
            animate={{ width: `${overall * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        {/* Label */}
        <div className="flex items-center justify-center">
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--text-tertiary-weight)',
              color: 'var(--text-tertiary-color)',
            }}
          >
            {progress.current} of {progress.total}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Up-Next sub-component (two-tone accent card) ─────────
interface UpNextCardProps {
  item: PlaybackItem;
  isRest: boolean;
}

const UpNextCard: React.FC<UpNextCardProps> = ({ item, isRest }) => {
  return (
    <div
      className="rounded-2xl py-3.5 px-5 flex items-center justify-between"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 183, 120, 0.12) 0%, rgba(0, 183, 120, 0.04) 100%)',
        border: '1px solid rgba(0, 183, 120, 0.15)',
      }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--text-tertiary-weight)',
            color: 'rgb(var(--core-teal))',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-default)',
          }}
        >
          {isRest ? 'Coming Up' : 'Up Next'}
        </span>
        <span
          className="truncate"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--text-primary-weight)',
            color: 'var(--text-primary-color)',
          }}
        >
          {item.label}
        </span>
      </div>
      <span
        className="flex-shrink-0 ml-3"
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--text-secondary-weight)',
          color: 'var(--text-secondary-color)',
        }}
      >
        {formatTimer(item.exercise?.durationSeconds ?? 0)}
      </span>
    </div>
  );
};

export { NowPlayingScreen };
