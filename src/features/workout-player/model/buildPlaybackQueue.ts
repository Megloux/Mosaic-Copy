/**
 * Converts a PlayerRoutine into a flat PlaybackItem queue.
 * Exercises only — plays exactly what's in the routine, nothing injected.
 * Zero external imports — fully self-contained.
 */

import { PlayerRoutine, PlaybackItem } from './types';

export function buildPlaybackQueue(routine: PlayerRoutine): PlaybackItem[] {
  const queue: PlaybackItem[] = [];
  let idx = 0;

  routine.blocks.forEach((block, blockIndex) => {
    if (block.exercises.length === 0) return;

    block.exercises.forEach((exercise) => {
      queue.push({
        id: `ex-${exercise.id}`,
        type: 'exercise',
        duration: exercise.durationSeconds,
        label: exercise.name || 'Exercise',
        exercise,
        blockName: block.name,
        blockType: block.type,
        blockIndex,
        queueIndex: idx++,
      });
    });
  });

  return queue;
}

/** Count only the exercise items in a queue */
export function countExercises(queue: PlaybackItem[]): number {
  return queue.filter((item) => item.type === 'exercise').length;
}

/** Count unique blocks in a queue */
export function countBlocks(queue: PlaybackItem[]): number {
  const blocks = new Set(queue.map((item) => item.blockIndex));
  return blocks.size;
}
