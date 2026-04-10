import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exercisesMock, type Exercise as RawExercise } from '@/data/core/exercises';
import { BuilderExercise, CATEGORIES, parseStandardTime, formatSeconds } from './types';
import { categoriesToShow } from './templateData';

// ---------- Adapter: raw exercise data → builder exercise ----------

function toBuilderExercise(raw: RawExercise): BuilderExercise {
  return {
    id: raw.id,
    exerciseName: raw.exercise_name,
    categoryId: raw.category_id,
    templateTags: raw.template_tags,
    standardTime: raw.standard_time,
    springSetup: {
      lightSprings: raw.spring_setup.light_springs,
      heavySprings: raw.spring_setup.heavy_springs,
    },
  };
}

const allExercises: BuilderExercise[] = exercisesMock.map(toBuilderExercise);

// ---------- Category color mapping ----------

const CATEGORY_COLORS: Record<string, string> = {
  c1: '239,68,68',    // red – Abs
  c2: '251,146,60',   // orange – Obliques
  c3: '168,85,247',   // purple – Heavy Pressing
  c4: '59,130,246',   // blue – Lunges/Squats
  c5: '34,197,94',    // green – Straps
  c6: '236,72,153',   // pink – Upper Body
  c7: '251,191,36',   // amber – Cardio
};

function catColor(categoryId: string, alpha = 1): string {
  const rgb = CATEGORY_COLORS[categoryId] ?? '255,255,255';
  return `rgba(${rgb},${alpha})`;
}

// ---------- Component ----------

interface ExercisePickerModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (exercise: BuilderExercise) => void;
  filterTemplateTags?: string[];  // from template slot — pre-filters to matching categories
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  open,
  onClose,
  onPick,
  filterTemplateTags,
}) => {
  // If template tags are provided, derive the relevant category IDs
  const templateCategoryIds = useMemo(
    () => (filterTemplateTags?.length ? categoriesToShow(filterTemplateTags) : null),
    [filterTemplateTags]
  );

  // Pre-filtered exercise pool based on template tags
  const exercisePool = useMemo(
    () =>
      templateCategoryIds
        ? allExercises.filter((e) => templateCategoryIds.includes(e.categoryId))
        : allExercises,
    [templateCategoryIds]
  );
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 200);
    } else {
      setSearch('');
      setActiveCategory(null);
      setJustAdded(null);
    }
  }, [open]);

  const filtered = useMemo(() => {
    let list = exercisePool;

    if (activeCategory) {
      list = list.filter((e) => e.categoryId === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.exerciseName.toLowerCase().includes(q) ||
          e.templateTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [search, activeCategory]);

  const handlePick = (exercise: BuilderExercise) => {
    onPick(exercise);
    setJustAdded(exercise.id);
    setTimeout(() => setJustAdded(null), 1200);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-md max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{
              backgroundColor: 'rgb(18,18,18)',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h2
                className="text-base font-bold"
                style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.02em' }}
              >
                Add Exercise
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  transitionDuration: 'var(--motion-natural)',
                }}
              >
                <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-5 pb-3">
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search exercises or tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
                  style={{
                    color: 'rgb(var(--core-white))',
                    fontWeight: 'var(--font-thin)',
                    letterSpacing: '0.01em',
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-0.5 rounded-full hover:bg-white/10"
                  >
                    <X className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </button>
                )}
              </div>
            </div>

            {/* Category pills */}
            <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(null)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: !activeCategory ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
                  color: !activeCategory ? 'rgb(var(--core-white))' : 'rgba(255,255,255,0.5)',
                  transitionDuration: 'var(--motion-natural)',
                }}
              >
                All ({exercisePool.length})
              </motion.button>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = exercisePool.filter((e) => e.categoryId === cat.id).length;
                if (count === 0) return null; // hide empty categories
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: isActive ? catColor(cat.id, 0.2) : 'rgba(255,255,255,0.05)',
                      color: isActive ? catColor(cat.id, 1) : 'rgba(255,255,255,0.5)',
                      transitionDuration: 'var(--motion-natural)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: catColor(cat.id, isActive ? 1 : 0.5) }}
                    />
                    {cat.name}
                    <span style={{ opacity: 0.6 }}>({count})</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="mx-5 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6">
              <p
                className="text-[11px] uppercase tracking-wider mb-3"
                style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
              >
                {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
                {activeCategory && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.name}`}
              </p>

              {filtered.length === 0 ? (
                <div className="py-14 flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <Search className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.15)' }} />
                  </div>
                  <p
                    className="text-sm mb-1"
                    style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}
                  >
                    No exercises found
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 'var(--font-thin)' }}
                  >
                    Try a different search term or category
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((exercise) => {
                    const isJustAdded = justAdded === exercise.id;
                    const springs = exercise.springSetup;
                    const hasSpringInfo = springs.lightSprings > 0 || springs.heavySprings > 0;

                    return (
                      <motion.button
                        key={exercise.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePick(exercise)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left group transition-colors"
                        style={{
                          backgroundColor: isJustAdded
                            ? 'rgba(0,183,120,0.08)'
                            : 'transparent',
                          transitionDuration: 'var(--motion-natural)',
                        }}
                      >
                        {/* Category colored avatar */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-transform"
                          style={{
                            backgroundColor: catColor(exercise.categoryId, 0.12),
                            color: catColor(exercise.categoryId, 0.9),
                          }}
                        >
                          {exercise.exerciseName.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium capitalize truncate"
                            style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
                          >
                            {exercise.exerciseName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="text-xs"
                              style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'var(--font-thin)' }}
                            >
                              {formatSeconds(parseStandardTime(exercise.standardTime))}
                            </span>
                            {hasSpringInfo && (
                              <>
                                <span className="text-white/10">·</span>
                                <span
                                  className="text-xs"
                                  style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 'var(--font-thin)' }}
                                >
                                  {springs.lightSprings > 0 && `${springs.lightSprings}L`}
                                  {springs.lightSprings > 0 && springs.heavySprings > 0 && ' '}
                                  {springs.heavySprings > 0 && `${springs.heavySprings}H`}
                                </span>
                              </>
                            )}
                            {exercise.templateTags.length > 0 && (
                              <>
                                <span className="text-white/10">·</span>
                                <span
                                  className="text-xs truncate"
                                  style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 'var(--font-thin)' }}
                                >
                                  {exercise.templateTags.join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Add / Added indicator */}
                        <div className="flex-shrink-0">
                          {isJustAdded ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'rgba(0,183,120,0.2)' }}
                            >
                              <Check className="w-3.5 h-3.5" style={{ color: 'rgb(var(--core-teal))' }} />
                            </motion.div>
                          ) : (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                transitionDuration: 'var(--motion-natural)',
                              }}
                            >
                              <Plus className="w-3.5 h-3.5" style={{ color: 'rgb(var(--core-teal))' }} />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
