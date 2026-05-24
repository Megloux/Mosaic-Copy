import React, { useState, useCallback, useMemo } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ArrowLeft, Clock, Save, RotateCcw, Plus, Dumbbell, Play, Trash2, PenLine, GripVertical, Copy, Clipboard, Check } from 'lucide-react';
import {
  BuilderRoutine,
  BuilderExercise,
  RoutineExerciseEntry,
  createDefaultRoutine,
  calcRoutineDuration,
  parseStandardTime,
} from './types';
import { DurationInput } from './BlockCard';
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
  const [selected, setSelected] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<RoutineExerciseEntry[]>([]);
  const [showActions, setShowActions] = useState(false);

  // Get active block's template tags for filtered picker
  const activeBlock = activeBlockId
    ? routine.blocks.find((b) => b.id === activeBlockId)
    : null;

  const totalDuration = calcRoutineDuration(routine);
  const totalExercises = useMemo(
    () => routine.blocks.reduce((t, b) => t + b.exercises.length, 0),
    [routine]
  );

  // ----- Selection -----

  const toggleSelect = useCallback((instanceId: string) => {
    setSelected((prev) => {
      const next = prev.includes(instanceId)
        ? prev.filter((id) => id !== instanceId)
        : [...prev, instanceId];
      if (next.length > 0) setShowActions(true);
      return next;
    });
  }, []);

  const handleCopy = useCallback(() => {
    const block = routine.blocks[0];
    if (!block) return;
    setClipboard(block.exercises.filter((e) => selected.includes(e.instanceId)));
  }, [routine, selected]);

  const handlePaste = useCallback(() => {
    if (clipboard.length === 0) return;
    const pasted = clipboard.map((e) => ({
      ...e,
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    }));
    setRoutine((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b, i) =>
        i === 0 ? { ...b, exercises: [...b.exercises, ...pasted] } : b
      ),
    }));
  }, [clipboard]);

  const handleDeleteSelected = useCallback(() => {
    setRoutine((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b, i) =>
        i === 0
          ? { ...b, exercises: b.exercises.filter((e) => !selected.includes(e.instanceId)) }
          : b
      ),
    }));
    setSelected([]);
  }, [selected]);

  const dismissActions = useCallback(() => {
    setSelected([]);
    setShowActions(false);
  }, []);

  // ----- Actions -----

  const openPickerForBlock = useCallback((blockId: string) => {
    dismissActions();
    setActiveBlockId(blockId);
    setPickerOpen(true);
  }, [dismissActions]);

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

      {/* ====== Exercises ====== */}
      <main className="flex-1 px-4 pt-4 pb-8" style={{ paddingBottom: showActions ? 72 : undefined }}>
        {totalExercises > 0 && (
          <Reorder.Group
            axis="y"
            values={routine.blocks[0]?.exercises ?? []}
            onReorder={(newOrder) => {
              setRoutine((prev) => ({
                ...prev,
                blocks: prev.blocks.map((b, i) =>
                  i === 0 ? { ...b, exercises: newOrder } : b
                ),
              }));
            }}
            className="space-y-2 mb-4"
          >
            {routine.blocks[0]?.exercises.map((entry, index) => (
              <Reorder.Item
                key={entry.instanceId}
                value={entry}
                className="flex items-center gap-2 rounded-xl px-3 py-3 group cursor-grab active:cursor-grabbing"
                style={{
                  backgroundColor: selected.includes(entry.instanceId)
                    ? 'rgba(0,183,120,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  border: selected.includes(entry.instanceId)
                    ? '1px solid rgba(0,183,120,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <GripVertical
                  className="w-4 h-4 flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text-tertiary-color)' }}
                />
                <button
                  onClick={() => toggleSelect(entry.instanceId)}
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: selected.includes(entry.instanceId)
                      ? 'rgb(var(--core-teal))'
                      : 'rgba(255,255,255,0.06)',
                    border: selected.includes(entry.instanceId)
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.12)',
                    transitionDuration: 'var(--motion-natural)',
                  }}
                  aria-label="Select exercise"
                >
                  {selected.includes(entry.instanceId) && (
                    <Check className="w-3 h-3" style={{ color: 'rgb(0,0,0)' }} />
                  )}
                </button>
                <span
                  className="w-5 text-center flex-shrink-0"
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--text-tertiary-weight)', color: 'var(--text-tertiary-color)' }}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    value={entry.exercise.exerciseName}
                    onChange={(e) => handleUpdateExercise(routine.blocks[0].id, entry.instanceId, { name: e.target.value })}
                    placeholder="Type exercise name..."
                    className="bg-transparent outline-none w-full truncate"
                    style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--text-primary-weight)', color: 'var(--text-primary-color)' }}
                  />
                </div>
                <DurationInput
                  value={entry.durationSeconds}
                  onChange={(s: number) => handleUpdateExercise(routine.blocks[0].id, entry.instanceId, { durationSeconds: s })}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {totalExercises === 0 && (
          <p
            className="text-center mb-4 mt-2"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
          >
            No exercises yet
          </p>
        )}

        {/* Add buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => openPickerForBlock(routine.blocks[0]?.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm transition-colors"
            style={{
              fontWeight: 500,
              backgroundColor: 'rgba(0,183,120,0.08)',
              color: 'rgb(var(--core-teal))',
              border: '1px solid rgba(0,183,120,0.15)',
              transitionDuration: 'var(--motion-natural)',
            }}
          >
            <Plus className="w-4 h-4" />
            From Library
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { dismissActions(); handleAddFreeformExercise(routine.blocks[0]?.id); }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm transition-colors"
            style={{
              fontWeight: 500,
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'var(--text-tertiary-color)',
              border: '1px dashed rgba(255,255,255,0.08)',
              transitionDuration: 'var(--motion-natural)',
            }}
          >
            <PenLine className="w-4 h-4" />
            Custom
          </motion.button>
        </div>
      </main>

      {/* ====== Bottom Action Bar (icons only) ====== */}
      {showActions && (
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-5 py-3"
          style={{
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)',
            zIndex: 50,
          }}
        >
          <button
            onClick={handleCopy}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            style={{ transitionDuration: 'var(--motion-natural)' }}
            aria-label="Copy selected"
          >
            <Copy className="w-5 h-5" style={{ color: 'rgb(var(--core-white))' }} />
          </button>
          <button
            onClick={handlePaste}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            style={{ transitionDuration: 'var(--motion-natural)', opacity: clipboard.length > 0 ? 1 : 0.3 }}
            aria-label="Paste"
            disabled={clipboard.length === 0}
          >
            <Clipboard className="w-5 h-5" style={{ color: 'rgb(var(--core-white))' }} />
          </button>
          <button
            onClick={handleDeleteSelected}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            style={{ transitionDuration: 'var(--motion-natural)' }}
            aria-label="Delete selected"
          >
            <Trash2 className="w-5 h-5" style={{ color: 'rgb(var(--core-white))' }} />
          </button>
        </div>
      )}

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
