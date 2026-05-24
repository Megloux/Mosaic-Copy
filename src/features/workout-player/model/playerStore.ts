/**
 * Workout Player Store
 *
 * Self-contained Zustand store — no external store dependencies.
 * The timer interval lives in the React component (useEffect);
 * this store is purely synchronous state + actions.
 */

import { create } from 'zustand';
import { PlayerRoutine, PlaybackItem, PlayerStatus, PlayerStats } from './types';
import { buildPlaybackQueue, countExercises, countBlocks } from './buildPlaybackQueue';

interface PlayerState {
  // Data
  routine: PlayerRoutine | null;
  queue: PlaybackItem[];
  currentIndex: number;
  timeRemaining: number;

  // Status
  status: PlayerStatus;

  // Stats (accumulated during the session)
  stats: PlayerStats;

  // Derived helpers (computed on read)
  currentItem: () => PlaybackItem | null;
  upNextItem: () => PlaybackItem | null;
  exerciseProgress: () => { current: number; total: number };
  overallProgress: () => number; // 0–1

  // Actions
  load: (routine: PlayerRoutine) => void;
  play: () => void;
  pause: () => void;
  skipForward: () => void;
  skipBack: () => void;
  tick: () => void;
  reset: () => void;
  cleanup: () => void;
}

const emptyStats: PlayerStats = {
  totalElapsed: 0,
  exercisesCompleted: 0,
  blocksCompleted: new Set(),
  totalExercises: 0,
  totalBlocks: 0,
  routineName: '',
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────
  routine: null,
  queue: [],
  currentIndex: 0,
  timeRemaining: 0,
  status: 'idle',
  stats: { ...emptyStats },

  // ── Derived helpers ────────────────────────────────────
  currentItem: () => {
    const { queue, currentIndex } = get();
    return queue[currentIndex] ?? null;
  },

  upNextItem: () => {
    const { queue, currentIndex } = get();
    // Find the next exercise-type item after current position
    for (let i = currentIndex + 1; i < queue.length; i++) {
      if (queue[i].type === 'exercise') return queue[i];
    }
    return null;
  },

  exerciseProgress: () => {
    const { queue, currentIndex } = get();
    const exerciseItems = queue.filter((q) => q.type === 'exercise');
    const currentExIdx = exerciseItems.findIndex(
      (e) => e.queueIndex >= currentIndex
    );
    return {
      current: Math.max(0, currentExIdx) + 1,
      total: exerciseItems.length,
    };
  },

  overallProgress: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return 0;
    return currentIndex / (queue.length - 1);
  },

  // ── Actions ────────────────────────────────────────────

  load: (routine) => {
    const queue = buildPlaybackQueue(routine);
    const first = queue[0] ?? null;

    set({
      routine,
      queue,
      currentIndex: 0,
      timeRemaining: first?.duration ?? 0,
      status: queue.length > 0 ? 'ready' : 'idle',
      stats: {
        totalElapsed: 0,
        exercisesCompleted: 0,
        blocksCompleted: new Set(),
        totalExercises: countExercises(queue),
        totalBlocks: countBlocks(queue),
        routineName: routine.name,
      },
    });
  },

  play: () => {
    const { status } = get();
    if (status === 'ready' || status === 'paused') {
      set({ status: 'playing' });
    }
  },

  pause: () => {
    if (get().status === 'playing') {
      set({ status: 'paused' });
    }
  },

  skipForward: () => {
    const { queue, currentIndex, status } = get();
    if (status === 'completed') return;

    const current = queue[currentIndex];
    const nextIndex = currentIndex + 1;

    // Mark exercise as completed if skipping past one
    if (current?.type === 'exercise') {
      set((s) => ({
        stats: {
          ...s.stats,
          exercisesCompleted: s.stats.exercisesCompleted + 1,
          blocksCompleted: new Set([...s.stats.blocksCompleted, current.blockIndex]),
        },
      }));
    }

    if (nextIndex >= queue.length) {
      // End of queue
      set({ status: 'completed', timeRemaining: 0 });
      return;
    }

    const nextItem = queue[nextIndex];
    const wasPlaying = status === 'playing';
    set({
      currentIndex: nextIndex,
      timeRemaining: nextItem.duration,
      status: wasPlaying ? 'playing' : 'paused',
    });
  },

  skipBack: () => {
    const { queue, currentIndex, timeRemaining, status } = get();
    const current = queue[currentIndex];
    if (!current) return;

    // If more than 2 seconds into the item, restart it
    if (current.duration - timeRemaining > 2) {
      set({ timeRemaining: current.duration });
      return;
    }

    // Otherwise go to previous item
    if (currentIndex > 0) {
      const prevItem = queue[currentIndex - 1];
      const wasPlaying = status === 'playing';
      set({
        currentIndex: currentIndex - 1,
        timeRemaining: prevItem.duration,
        status: wasPlaying ? 'playing' : 'paused',
      });
    }
  },

  tick: () => {
    const { timeRemaining, currentIndex, queue, status } = get();
    if (status !== 'playing') return;

    // Increment elapsed time
    set((s) => ({
      stats: { ...s.stats, totalElapsed: s.stats.totalElapsed + 1 },
    }));

    if (timeRemaining <= 1) {
      // Current item finished — advance
      const current = queue[currentIndex];

      // Track completed exercise
      if (current?.type === 'exercise') {
        set((s) => ({
          stats: {
            ...s.stats,
            exercisesCompleted: s.stats.exercisesCompleted + 1,
            blocksCompleted: new Set([...s.stats.blocksCompleted, current.blockIndex]),
          },
        }));
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        set({ status: 'completed', timeRemaining: 0 });
        // Haptic: workout complete
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        return;
      }

      const nextItem = queue[nextIndex];
      set({
        currentIndex: nextIndex,
        timeRemaining: nextItem.duration,
      });

      // Haptic: item transition
      if ('vibrate' in navigator) navigator.vibrate([80]);
    } else {
      // Haptic: 3-2-1 countdown
      if (timeRemaining <= 4 && 'vibrate' in navigator) {
        navigator.vibrate([40]);
      }
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  reset: () => {
    const { routine } = get();
    if (routine) {
      get().load(routine);
    }
  },

  cleanup: () => {
    set({
      routine: null,
      queue: [],
      currentIndex: 0,
      timeRemaining: 0,
      status: 'idle',
      stats: { ...emptyStats },
    });
  },
}));
