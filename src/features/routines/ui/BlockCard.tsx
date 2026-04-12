import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, GripVertical, Zap, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuilderBlock, RoutineExerciseEntry, formatSeconds } from './types';

// ---------- Block type visual config ----------

interface BlockTheme {
  accent: string;
  accentFaded: string;
  gradient: string;
  icon: React.ReactNode;
  label: string;
}

const BLOCK_THEMES: Record<string, BlockTheme> = {
  warmup: {
    accent: 'rgba(255,255,255,0.6)',
    accentFaded: 'rgba(255,255,255,0.08)',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
    icon: <Zap className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.6)' }} />,
    label: 'WARM UP',
  },
  main: {
    accent: 'rgb(var(--core-teal))',
    accentFaded: 'rgba(0,183,120,0.15)',
    gradient: 'linear-gradient(135deg, rgba(0,183,120,0.08) 0%, rgba(0,183,120,0.02) 100%)',
    icon: <Zap className="w-3.5 h-3.5" style={{ color: 'rgb(var(--core-teal))' }} />,
    label: 'MAIN',
  },
  cooldown: {
    accent: 'rgba(255,255,255,0.5)',
    accentFaded: 'rgba(255,255,255,0.06)',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
    icon: <Zap className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />,
    label: 'COOL DOWN',
  },
};

const DEFAULT_THEME: BlockTheme = {
  accent: 'rgb(var(--core-white))',
  accentFaded: 'rgba(255,255,255,0.10)',
  gradient: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
  icon: <Zap className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.6)' }} />,
  label: 'BLOCK',
};

// ---------- BlockCard ----------

interface BlockCardProps {
  block: BuilderBlock;
  onAddExercise: () => void;
  onAddFreeformExercise: () => void;
  onRemoveExercise: (instanceId: string) => void;
  onUpdateExercise?: (instanceId: string, updates: { name?: string; durationSeconds?: number }) => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  onAddExercise,
  onAddFreeformExercise,
  onRemoveExercise,
  onUpdateExercise,
}) => {
  const [expanded, setExpanded] = useState(true);

  const blockDuration = block.exercises.reduce((t, e) => t + e.durationSeconds, 0);
  const theme = BLOCK_THEMES[block.type] ?? DEFAULT_THEME;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: theme.gradient,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-4 text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-center gap-3">
          {/* Block type icon badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme.accentFaded }}
          >
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-sm font-semibold"
                style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
              >
                {block.name}
              </h3>
              <span
                className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: theme.accentFaded,
                  color: theme.accent,
                }}
              >
                {theme.label}
              </span>
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-secondary-color)', fontWeight: 'var(--text-secondary-weight)' }}
            >
              {block.exercises.length}
              {block.slotCount
                ? ` of ${block.slotCount.min}${block.slotCount.max !== block.slotCount.min ? `-${block.slotCount.max}` : ''}`
                : ''
              }
              {' exercise'}{block.exercises.length !== 1 ? 's' : ''}
              {blockDuration > 0 && ` · ${formatSeconds(blockDuration)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ transitionDuration: 'var(--motion-natural)' }}
            onClick={(e) => {
              e.stopPropagation();
              onAddExercise();
            }}
            role="button"
            aria-label="Add exercise to block"
          >
            <Plus className="w-4 h-4" style={{ color: theme.accent }} />
          </motion.div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
          </motion.div>
        </div>
      </button>

      {/* Exercise list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.24, 1.12, 0.76, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-1"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              {block.exercises.length === 0 ? (
                /* ---- Premium empty state ---- */
                <div className="py-8 flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: theme.accentFaded }}
                  >
                    <Plus className="w-5 h-5" style={{ color: theme.accent, opacity: 0.6 }} />
                  </div>
                  <p
                    className="text-sm mb-1"
                    style={{ color: 'var(--text-secondary-color)', fontWeight: 'var(--text-secondary-weight)' }}
                  >
                    {block.instructions || 'No exercises yet'}
                  </p>
                  <p
                    className="text-xs mb-4"
                    style={{ color: 'var(--text-muted-color)', fontWeight: 'var(--text-muted-weight)' }}
                  >
                    {block.slotCount
                      ? `Pick ${block.slotCount.min}${block.slotCount.max !== block.slotCount.min ? `-${block.slotCount.max}` : ''} exercises`
                      : 'Tap below to browse the exercise library'
                    }
                  </p>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onAddExercise}
                      className="text-xs font-semibold px-5 py-2 rounded-full transition-colors"
                      style={{
                        backgroundColor: theme.accentFaded,
                        color: theme.accent,
                        transitionDuration: 'var(--motion-natural)',
                      }}
                    >
                      + From Library
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onAddFreeformExercise}
                      className="text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.5)',
                        transitionDuration: 'var(--motion-natural)',
                      }}
                    >
                      <PenLine className="w-3 h-3" />
                      Custom
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {block.exercises.map((entry, idx) => (
                    <ExerciseRow
                      key={entry.instanceId}
                      entry={entry}
                      index={idx}
                      accent={theme.accent}
                      accentFaded={theme.accentFaded}
                      onRemove={() => onRemoveExercise(entry.instanceId)}
                      onUpdate={onUpdateExercise
                        ? (updates) => onUpdateExercise(entry.instanceId, updates)
                        : undefined
                      }
                    />
                  ))}

                  {/* Add more buttons */}
                  <div className="flex items-center gap-2 pt-2 px-1">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onAddExercise}
                      className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                      style={{
                        backgroundColor: theme.accentFaded,
                        color: theme.accent,
                        transitionDuration: 'var(--motion-natural)',
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      Library
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onAddFreeformExercise}
                      className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.4)',
                        transitionDuration: 'var(--motion-natural)',
                      }}
                    >
                      <PenLine className="w-3 h-3" />
                      Custom
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- Exercise row within a block ----------

const ExerciseRow: React.FC<{
  entry: RoutineExerciseEntry;
  index: number;
  accent: string;
  accentFaded: string;
  onRemove: () => void;
  onUpdate?: (updates: { name?: string; durationSeconds?: number }) => void;
}> = ({ entry, index, accent, accentFaded, onRemove, onUpdate }) => {
  const springs = entry.exercise.springSetup;
  const hasSpringInfo = springs.lightSprings > 0 || springs.heavySprings > 0;
  const isCustom = entry.exercise.id.startsWith('custom-');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl group"
      style={{
        backgroundColor: isCustom ? accentFaded.replace(/[\d.]+\)$/, '0.04)') : 'rgba(255,255,255,0.025)',
        border: isCustom ? `1px dashed ${accentFaded}` : '1px solid transparent',
        transitionProperty: 'background-color',
        transitionDuration: 'var(--motion-natural)',
      }}
      whileHover={{ backgroundColor: isCustom ? accentFaded : 'rgba(255,255,255,0.05)' }}
    >
      {/* Drag handle */}
      <GripVertical
        className="w-4 h-4 flex-shrink-0 cursor-grab active:cursor-grabbing transition-colors"
        style={{
          color: 'rgba(255,255,255,0.12)',
          transitionDuration: 'var(--motion-natural)',
        }}
      />

      {/* Index badge */}
      <span
        className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
        style={{
          backgroundColor: accentFaded,
          color: accent,
        }}
      >
        {index + 1}
      </span>

      {/* Name + metadata */}
      <div className="flex-1 min-w-0">
        {isCustom && onUpdate ? (
          <input
            type="text"
            value={entry.exercise.exerciseName}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Type exercise name…"
            autoFocus={!entry.exercise.exerciseName}
            className="w-full bg-transparent text-sm font-medium outline-none placeholder-white/20"
            style={{
              color: 'rgb(var(--core-white))',
              letterSpacing: '-0.01em',
            }}
          />
        ) : (
          <p
            className="text-sm font-medium capitalize truncate"
            style={{
              color: 'rgb(var(--core-white))',
              letterSpacing: '-0.01em',
            }}
          >
            {entry.exercise.exerciseName}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          {isCustom && onUpdate ? (
            <select
              value={entry.durationSeconds}
              onChange={(e) => onUpdate({ durationSeconds: Number(e.target.value) })}
              className="bg-transparent text-xs outline-none cursor-pointer"
              style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
            >
              {[15, 30, 45, 60, 90, 120].map((s) => (
                <option key={s} value={s} style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                  {formatSeconds(s)}
                </option>
              ))}
            </select>
          ) : (
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
            >
              {formatSeconds(entry.durationSeconds)}
            </span>
          )}
          {hasSpringInfo && (
            <>
              <span className="text-white/10">·</span>
              <span
                className="text-xs"
                style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
              >
                {springs.lightSprings > 0 && `${springs.lightSprings}L`}
                {springs.lightSprings > 0 && springs.heavySprings > 0 && ' '}
                {springs.heavySprings > 0 && `${springs.heavySprings}H`}
              </span>
            </>
          )}
          {!isCustom && entry.exercise.templateTags.length > 0 && (
            <>
              <span className="text-white/10">·</span>
              <span
                className="text-xs truncate"
                style={{ color: 'var(--text-muted-color)', fontWeight: 'var(--text-muted-weight)' }}
              >
                {entry.exercise.templateTags.join(', ')}
              </span>
            </>
          )}
          {isCustom && (
            <>
              <span className="text-white/10">·</span>
              <span
                className="text-[10px]"
                style={{ color: accent, opacity: 0.5, fontWeight: 600, letterSpacing: '0.03em' }}
              >
                CUSTOM
              </span>
            </>
          )}
        </div>
      </div>

      {/* Remove */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
        style={{ transitionDuration: 'var(--motion-natural)' }}
        aria-label="Remove exercise"
      >
        <Trash2 className="w-3.5 h-3.5" style={{ color: 'rgb(239,68,68)' }} />
      </motion.button>
    </motion.div>
  );
};
