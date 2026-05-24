import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowLeft, Clock, Dumbbell, Layers } from 'lucide-react';
import { PlayerStats } from '../model/types';
import { formatDurationLabel } from '../lib/formatTime';

interface CompletionScreenProps {
  stats: PlayerStats;
  onDone: () => void;
  onRestart: () => void;
}

/**
 * CompletionScreen
 *
 * Shown when the workout finishes. Displays session stats
 * and offers "Done" / "Repeat" actions.
 */
const CompletionScreen: React.FC<CompletionScreenProps> = ({
  stats,
  onDone,
  onRestart,
}) => {
  const statItems = [
    {
      icon: Clock,
      label: 'Total Time',
      value: formatDurationLabel(stats.totalElapsed),
    },
    {
      icon: Dumbbell,
      label: 'Exercises',
      value: `${stats.exercisesCompleted} of ${stats.totalExercises}`,
    },
    {
      icon: Layers,
      label: 'Blocks',
      value: `${stats.blocksCompleted.size} of ${stats.totalBlocks}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: 'rgb(var(--core-black))',
        fontFamily: 'var(--font-primary)',
        zIndex: 'var(--layer-overlay)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 183, 120, 0.12)' }}
      />

      {/* Check icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <CheckCircle
          className="w-16 h-16 mb-6"
          style={{ color: 'rgb(var(--core-teal))' }}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--text-primary-weight)',
          color: 'var(--text-primary-color)',
          letterSpacing: '-0.02em',
        }}
      >
        Workout Complete
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-2 mb-10"
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--text-secondary-weight)',
          color: 'var(--text-secondary-color)',
        }}
      >
        {stats.routineName}
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-6 mb-12"
      >
        {statItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <item.icon
              className="w-4 h-4"
              style={{ color: 'rgb(var(--core-teal))' }}
            />
            <span
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--text-primary-weight)',
                color: 'var(--text-primary-color)',
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--text-tertiary-weight)',
                color: 'var(--text-tertiary-color)',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 w-full"
        style={{ maxWidth: 280 }}
      >
        <button
          onClick={onDone}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{
            backgroundColor: 'rgb(var(--core-teal))',
            color: 'rgb(0, 0, 0)',
            transitionDuration: 'var(--motion-natural)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Builder
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-secondary-color)',
            transitionDuration: 'var(--motion-natural)',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Repeat Workout
        </button>
      </motion.div>
    </div>
  );
};

export { CompletionScreen };
