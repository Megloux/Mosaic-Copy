import React, { useEffect } from 'react';
import { PlayerRoutine } from '../model/types';
import { usePlayerStore } from '../model/playerStore';
import { NowPlayingScreen } from './NowPlayingScreen';
import { CompletionScreen } from './CompletionScreen';

interface PlayerPageProps {
  routine: PlayerRoutine;
  onClose: () => void;
}

/**
 * PlayerPage
 *
 * Top-level orchestrator for the Routine Player.
 * Receives a BuilderRoutine, loads it into the player store,
 * and delegates to the appropriate screen based on status.
 *
 * Standalone — no router dependencies, just state transitions.
 */
const PlayerPage: React.FC<PlayerPageProps> = ({ routine, onClose }) => {
  const { status, stats, load, reset, cleanup } = usePlayerStore();

  // Load the routine into the store on mount
  useEffect(() => {
    load(routine);
    return () => cleanup();
  }, [routine, load, cleanup]);

  // Empty routine guard
  if (status === 'idle') {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center px-6"
        style={{
          backgroundColor: 'rgb(var(--core-black))',
          fontFamily: 'var(--font-primary)',
          zIndex: 'var(--layer-overlay)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--text-secondary-weight)',
            color: 'var(--text-secondary-color)',
          }}
        >
          No exercises to play. Add exercises to your routine first.
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{
            backgroundColor: 'rgb(var(--core-teal))',
            color: 'rgb(0, 0, 0)',
            transitionDuration: 'var(--motion-natural)',
          }}
        >
          Back to Builder
        </button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <CompletionScreen
        stats={stats}
        onDone={onClose}
        onRestart={reset}
      />
    );
  }

  // ready | playing | paused → show the main player
  return <NowPlayingScreen onClose={onClose} />;
};

export { PlayerPage };
