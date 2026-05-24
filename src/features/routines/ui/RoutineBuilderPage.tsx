import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Save, RotateCcw, Plus, Dumbbell, Layers, Play } from 'lucide-react';
import {
  BuilderRoutine,
  BuilderBlock,
  BuilderExercise,
  RoutineExerciseEntry,
  createDefaultRoutine,
  calcRoutineDuration,
  parseStandardTime,
} from './types';
import { BlockCard } from './BlockCard';
import { ExercisePickerModal } from './ExercisePickerModal';

/**
 * RoutineBuilderPage
 *
 * Fully self-contained routine builder.
 * - Manages its own state via useState (no external store dependency).
 * - Reads exercise data from src/data/core/exercises.ts through ExercisePickerModal.
 * - Exports a single component that can be dropped into any route.
 *
 * Design: Spotify gradient hero + Seconds Pro clean workout feel.
 */
interface RoutineBuilderPageProps {
  initialRoutine?: BuilderRoutine;
  onBack?: () => void;
  onPlay?: (routine: BuilderRoutine) => void;
}

export const RoutineBuilderPage: React.FC<RoutineBuilderPageProps> = ({
  initialRoutine,
  onBack,
  onPlay,
}) => {
  // ----- State -----
  const [routine, setRoutine] = useState<BuilderRoutine>(
    () => initialRoutine ?? createDefaultRoutine()
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);

  // Get active block's template tags for filtered picker
  const activeBlock = activeBlockId
    ? routine.blocks.find((b) => b.id === activeBlockId)
    : null;

  const totalDuration = calcRoutineDuration(routine);
  const totalExercises = useMemo(
    () => routine.blocks.reduce((t, b) => t + b.exercises.length, 0),
    [routine]
  );

  // ----- Actions -----

  const openPickerForBlock = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    setPickerOpen(true);
  }, []);

  const handlePickExercise = useCallback(
    (exercise: BuilderExercise) => {
      if (!activeBlockId) return;

      const entry: RoutineExerciseEntry = {
        instanceId: `inst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        exercise,
        durationSeconds: parseStandardTime(exercise.standardTime),
        notes: '',
      };

      setRoutine((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === activeBlockId
            ? { ...block, exercises: [...block.exercises, entry] }
            : block
        ),
      }));
    },
    [activeBlockId]
  );

  const handleAddFreeformExercise = useCallback(
    (blockId: string) => {
      const entry: RoutineExerciseEntry = {
        instanceId: `inst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        exercise: {
          id: `custom-${Date.now()}`,
          exerciseName: '',
          categoryId: '',
          templateTags: [],
          standardTime: '0:30',
          springSetup: { lightSprings: 0, heavySprings: 0 },
        },
        durationSeconds: 30,
        notes: '',
      };

      setRoutine((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? { ...block, exercises: [...block.exercises, entry] }
            : block
        ),
      }));
    },
    []
  );

  const handleUpdateExercise = useCallback(
    (blockId: string, instanceId: string, updates: { name?: string; durationSeconds?: number }) => {
      setRoutine((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                exercises: block.exercises.map((e) =>
                  e.instanceId === instanceId
                    ? {
                        ...e,
                        ...(updates.durationSeconds !== undefined && { durationSeconds: updates.durationSeconds }),
                        exercise: {
                          ...e.exercise,
                          ...(updates.name !== undefined && { exerciseName: updates.name }),
                        },
                      }
                    : e
                ),
              }
            : block
        ),
      }));
    },
    []
  );

  const handleRemoveExercise = useCallback(
    (blockId: string, instanceId: string) => {
      setRoutine((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? { ...block, exercises: block.exercises.filter((e) => e.instanceId !== instanceId) }
            : block
        ),
      }));
    },
    []
  );

  const handleAddBlock = useCallback(() => {
    const id = `b-${Date.now()}`;
    const newBlock: BuilderBlock = {
      id,
      name: 'New Block',
      type: 'main',
      exercises: [],
    };
    setRoutine((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  }, []);

  const handleReset = useCallback(() => {
    setRoutine(createDefaultRoutine());
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setRoutine((prev) => ({ ...prev, name }));
  }, []);

  // Format minutes for hero display
  const durationMinutes = Math.ceil(totalDuration / 60);

  // ----- Render -----

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'rgb(var(--core-black))',
        color: 'rgb(var(--core-white))',
        fontFamily: 'var(--font-primary)',
      }}
    >
      {/* ====== Compact sticky nav ====== */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4"
        style={{
          height: 'var(--header-height)',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          className="p-1.5 -ml-1.5 rounded-full hover:bg-white/10 transition-colors"
          style={{ transitionDuration: 'var(--motion-natural)' }}
          aria-label="Back"
          onClick={() => (onBack ? onBack() : window.history.back())}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--core-white))' }} />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ transitionDuration: 'var(--motion-natural)' }}
            aria-label="Reset routine"
            title="Reset routine"
          >
            <RotateCcw className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
          </button>

          {onPlay && totalExercises > 0 && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
              style={{
                backgroundColor: 'rgb(var(--core-teal))',
                color: 'rgb(0,0,0)',
                letterSpacing: '0.03em',
                transitionDuration: 'var(--motion-natural)',
              }}
              onClick={() => onPlay(routine)}
            >
              <Play className="w-3.5 h-3.5" />
              Play
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
            style={{
              backgroundColor: totalExercises > 0 && !onPlay ? 'rgb(var(--core-teal))' : 'rgba(255,255,255,0.08)',
              color: totalExercises > 0 && !onPlay ? 'rgb(0,0,0)' : 'var(--text-secondary-color)',
              letterSpacing: '0.03em',
              transitionDuration: 'var(--motion-natural)',
            }}
            onClick={() => {
              console.log('[RoutineBuilder] Save clicked — routine:', routine);
              alert('Save will be connected in Phase 3!');
            }}
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </motion.button>
        </div>
      </header>

      {/* ====== Gradient Hero Section (Spotify-style) ====== */}
      <section
        className="relative px-5 pt-8 pb-6 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,183,120,0.18) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* Subtle ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full blur-[100px] pointer-events-none"
          style={{ backgroundColor: 'rgba(0,183,120,0.12)' }}
        />

        {/* Routine icon */}
        <div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(0,183,120,0.25) 0%, rgba(0,183,120,0.08) 100%)',
            boxShadow: '0 8px 32px rgba(0,183,120,0.15)',
          }}
        >
          <Dumbbell className="w-7 h-7" style={{ color: 'rgb(var(--core-teal))' }} />
        </div>

        {/* Editable name */}
        <div className="relative">
          {editingName ? (
            <input
              autoFocus
              value={routine.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              className="bg-transparent outline-none border-b-2 w-full pb-1"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'rgb(var(--core-white))',
                borderColor: 'rgb(var(--core-teal))',
              }}
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-left w-full group"
            >
              <h1
                className="leading-tight"
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'rgb(var(--core-white))',
                }}
              >
                {routine.name}
              </h1>
              <span
                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)', transitionDuration: 'var(--motion-natural)' }}
              >
                tap to rename
              </span>
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="relative flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: 'rgb(var(--core-teal))' }} />
            <span
              className="text-sm"
              style={{ fontWeight: 'var(--text-secondary-weight)', color: 'var(--text-secondary-color)' }}
            >
              {durationMinutes > 0 ? `${durationMinutes} min` : '0 min'}
            </span>
          </div>
          <div
            className="w-px h-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" style={{ color: 'rgb(var(--core-teal))' }} />
            <span
              className="text-sm"
              style={{ fontWeight: 'var(--text-secondary-weight)', color: 'var(--text-secondary-color)' }}
            >
              {routine.blocks.length} block{routine.blocks.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div
            className="w-px h-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5" style={{ color: 'rgb(var(--core-teal))' }} />
            <span
              className="text-sm"
              style={{ fontWeight: 'var(--text-secondary-weight)', color: 'var(--text-secondary-color)' }}
            >
              {totalExercises} exercise{totalExercises !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ====== Blocks ====== */}
      <main className="flex-1 px-4 pt-2 pb-8">
        <div className="space-y-3">
          {routine.blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
                ease: [0.24, 1.12, 0.76, 1],
              }}
            >
              <BlockCard
                block={block}
                onAddExercise={() => openPickerForBlock(block.id)}
                onAddFreeformExercise={() => handleAddFreeformExercise(block.id)}
                onRemoveExercise={(instanceId) => handleRemoveExercise(block.id, instanceId)}
                onUpdateExercise={(instanceId, updates) => handleUpdateExercise(block.id, instanceId, updates)}
              />
            </motion.div>
          ))}
        </div>

        {/* Add block */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddBlock}
          className="w-full flex items-center justify-center gap-2 py-3.5 mt-3 rounded-xl text-sm transition-colors"
          style={{
            fontWeight: 500,
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: 'var(--text-tertiary-color)',
            border: '1px dashed rgba(255,255,255,0.08)',
            transitionDuration: 'var(--motion-natural)',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Block
        </motion.button>
      </main>

      {/* ====== Exercise Picker ====== */}
      <ExercisePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePickExercise}
        filterTemplateTags={activeBlock?.templateTags}
      />
    </div>
  );
};
