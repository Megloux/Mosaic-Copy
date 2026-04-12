/**
 * Template Data — Standalone
 *
 * All 9 master-trainer templates converted from template_definitions.sql.
 * Includes the tag → category mapping so the exercise picker can filter
 * exercises by what the template slot actually needs.
 *
 * Kept independent: no Supabase calls, no external store dependencies.
 * When we connect to the real backend, we'll swap this for an API call.
 */

// ---------- Tag → Category Mapping ----------

/**
 * Template blocks use high-level tags (e.g. "Core", "HeavyPressing").
 * Exercises use low-level tags and category IDs (c1-c7).
 * This map bridges them: given a template tag, which category IDs should we show?
 */
export const TAG_TO_CATEGORIES: Record<string, string[]> = {
  core:             ['c1'],           // Abs
  obliques:         ['c2'],           // Obliques
  heavy_pressing:   ['c3'],           // LowerBodyHeavyPressing
  lower_body:       ['c4', 'c5'],     // Lunges/Squats/Deadlifts + Straps
  footstrap:        ['c5'],           // LowerBodyStraps
  upper_body:       ['c6'],           // UpperBody
  heavy_bilateral:  ['c3', 'c4'],     // Heavy legs, bilateral moves
  light_resistance: ['c4', 'c6'],     // Light lunges + light upper body
  heavy_resistance: ['c3', 'c6'],     // Heavy pressing + heavy upper body
  bodyweight:       ['c1', 'c4', 'c6'], // Core, lower, upper bodyweight
  power_round:      ['c7'],           // Cardio Bursts
};

/** Given template tags, return the set of category IDs to filter exercises by */
export function categoriesToShow(templateTags: string[]): string[] {
  const cats = new Set<string>();
  templateTags.forEach((tag) => {
    const mapped = TAG_TO_CATEGORIES[tag];
    if (mapped) mapped.forEach((c) => cats.add(c));
  });
  return Array.from(cats);
}

// ---------- Level 2: Tag → Exercise Tag Refinement ----------

/**
 * For compound/cross-category template tags, this map specifies which
 * exercise-level template_tags values are relevant.
 *
 * - `tags`: exercise template_tags values that belong in this slot.
 *   EMPTY for now — fill in when exercises are fully tagged.
 * - `zeroSprings`: if true, match exercises with 0 total springs.
 *
 * Simple template tags (core, obliques, heavy_pressing, etc.) have NO
 * entry here — they only need Level 1 (category) filtering.
 *
 * When an entry exists but tags is empty, Level 2 is effectively a no-op
 * (all exercises from the Level 1 pool pass through). As tag values are
 * added, filtering automatically becomes more precise.
 */
export interface ExerciseTagFilter {
  tags: string[];        // exercise-level template_tags to match
  zeroSprings?: boolean; // match exercises with 0 total springs
}

export const TAG_TO_EXERCISE_TAGS: Record<string, ExerciseTagFilter> = {
  heavy_resistance: { tags: [] },
  light_resistance: { tags: [] },
  heavy_bilateral:  { tags: [] },
  bodyweight:       { tags: [], zeroSprings: true },
};

/**
 * Given template tags, return a combined ExerciseTagFilter if Level 2
 * refinement applies, or null if only Level 1 (category) is needed.
 */
export function exerciseTagFilter(templateTags: string[]): ExerciseTagFilter | null {
  const mergedTags: string[] = [];
  let zeroSprings = false;
  let hasLevel2 = false;

  templateTags.forEach((tag) => {
    const filter = TAG_TO_EXERCISE_TAGS[tag];
    if (filter) {
      hasLevel2 = true;
      mergedTags.push(...filter.tags);
      if (filter.zeroSprings) zeroSprings = true;
    }
  });

  if (!hasLevel2) return null;
  return { tags: [...new Set(mergedTags)], zeroSprings };
}

// ---------- Template Types ----------

export interface TemplateBlockDef {
  blockId: string;          // b1-b7 body position
  name: string;             // display name
  templateTags: string[];   // high-level filtering tags
  exerciseCount: {
    min: number;
    max: number;
  };
  instructions: string;     // guidance for the instructor
  isWarmup: boolean;
  hasCardioBurst: boolean;
}

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  blocks: TemplateBlockDef[];
  isProOnly: boolean;
  // Visual identity for gallery cards
  accentColor: string;      // gradient/accent for the card
  icon: string;             // emoji or icon name
  estimatedMinutes: number; // rough total time
}

// ---------- Helper ----------

function estimateMinutes(blocks: TemplateBlockDef[]): number {
  // Assume ~1.5 min per exercise on average
  const totalExercises = blocks.reduce(
    (sum, b) => sum + Math.round((b.exerciseCount.min + b.exerciseCount.max) / 2),
    0
  );
  return Math.round(totalExercises * 1.5);
}

// ---------- All Templates ----------

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'tpl-the-og',
    name: 'The OG',
    description: 'Classic Pilates exercises focusing on fundamental movement patterns and core stability',
    accentColor: '0,183,120',     // teal — the classic
    icon: '🏛️',
    isProOnly: false,
    blocks: [
      { blockId: 'b1', name: 'Core Warmup',       templateTags: ['core'],      exerciseCount: { min: 4, max: 5 }, instructions: '5 core exercises',                             isWarmup: true,  hasCardioBurst: false },
      { blockId: 'b2', name: 'Leg Block 1',        templateTags: ['lower_body'], exerciseCount: { min: 4, max: 5 }, instructions: '5 Leg 1 exercises',                            isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Leg Block 2',        templateTags: ['lower_body'], exerciseCount: { min: 4, max: 5 }, instructions: '5 Leg 2 exercises',                            isWarmup: false, hasCardioBurst: false },
      { blockId: 'b4', name: 'Oblique Block 1',    templateTags: ['obliques'],  exerciseCount: { min: 2, max: 3 }, instructions: '2-3 Oblique 1 exercises',                      isWarmup: false, hasCardioBurst: false },
      { blockId: 'b5', name: 'Oblique Block 2',    templateTags: ['obliques'],  exerciseCount: { min: 2, max: 3 }, instructions: '2-3 Oblique 2 exercises',                      isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Upper Body Block',   templateTags: ['upper_body'], exerciseCount: { min: 4, max: 5 }, instructions: '5 Upper Body exercises',                       isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Core Block',  templateTags: ['core'],      exerciseCount: { min: 3, max: 5 }, instructions: '3-5 ending core exercises',                    isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-power-to-precision',
    name: 'Power to Precision',
    description: 'Build power through controlled movements, focusing on form and precision in each exercise',
    accentColor: '0,183,120',     // teal
    icon: '⚡',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Warmup Block',          templateTags: ['core'],            exerciseCount: { min: 4, max: 5 }, instructions: '5 exercises core / cardio burst warm up',                isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b7', name: 'Heavy Bilateral Warmup', templateTags: ['heavy_bilateral'], exerciseCount: { min: 1, max: 1 }, instructions: 'Heavy bilateral warmup. Ex: Superhero, Bridge Press',    isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Heavy Pressing Legs',    templateTags: ['heavy_pressing'],  exerciseCount: { min: 2, max: 3 }, instructions: 'Heavy Pressing Legs',                                    isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Footstrap Block',        templateTags: ['footstrap'],      exerciseCount: { min: 1, max: 2 }, instructions: 'Footstrap Lower Body Moves',                             isWarmup: false, hasCardioBurst: false },
      { blockId: 'b7', name: 'Light Resistance',       templateTags: ['light_resistance'],exerciseCount: { min: 1, max: 2 }, instructions: 'Light pulling/lunges/adductor work',                     isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Heavy Upper Body',       templateTags: ['heavy_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Heavy Pushing or Pulling. Ex: Heavy chest press, rows',  isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Light Cable Work',       templateTags: ['light_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Lighter Cable work',                                     isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Bodyweight',             templateTags: ['bodyweight'],     exerciseCount: { min: 1, max: 2 }, instructions: 'Bodyweight exercises',                                    isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Core Block',      templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending Core Block',                                      isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-upper-body-focus',
    name: 'Upper Body Focus',
    description: 'Concentrated upper body workout incorporating pressing, pulling, and stabilization',
    accentColor: '0,183,120',     // teal
    icon: '💪',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Core Warmup',        templateTags: ['core'],           exerciseCount: { min: 4, max: 5 }, instructions: '5 exercises core / cardio burst warm up', isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b2', name: 'Bilateral Warmup',   templateTags: ['lower_body'],      exerciseCount: { min: 1, max: 2 }, instructions: '1-2 bilateral warm up exercises',        isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Heavy Upper Body',   templateTags: ['heavy_pressing'],  exerciseCount: { min: 2, max: 3 }, instructions: '2-3 Heavy Pressing exercises',           isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Main Upper Body Block', templateTags: ['upper_body'],   exerciseCount: { min: 4, max: 5 }, instructions: '5 exercises',                            isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Core Block',  templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending Core Block',                      isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-lower-body-focus',
    name: 'Lower Body Focus',
    description: 'Targeted lower body exercises focusing on strength, stability, and power',
    accentColor: '0,183,120',     // teal
    icon: '🦵',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Core Warmup',        templateTags: ['core'],            exerciseCount: { min: 4, max: 5 }, instructions: '5 exercises core / cardio burst warm up',     isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b2', name: 'Bilateral Warmup',   templateTags: ['lower_body'],       exerciseCount: { min: 1, max: 2 }, instructions: '1-2 bilateral warm up exercises',            isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Heavy Legs',          templateTags: ['heavy_pressing'],  exerciseCount: { min: 2, max: 3 }, instructions: '2-3 Heavy Pressing Legs',                    isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Footstrap Block',     templateTags: ['footstrap'],      exerciseCount: { min: 2, max: 3 }, instructions: '2-3 Footstrap Lower Body Moves',             isWarmup: false, hasCardioBurst: false },
      { blockId: 'b7', name: 'Light Resistance',    templateTags: ['light_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: '2 Light pulling/lunges/adductor work',       isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Core Block',   templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending Core Block',                          isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-cable-strap',
    name: 'Cable/Strap Focused',
    description: 'Utilizing cables and straps for dynamic resistance training and stability work',
    accentColor: '0,183,120',     // teal
    icon: '🔗',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Cable Warmup',           templateTags: ['core'],      exerciseCount: { min: 4, max: 5 }, instructions: '5 opening cable strap warm up',                     isWarmup: true,  hasCardioBurst: false },
      { blockId: 'b4', name: 'Oblique Cable Block 1',   templateTags: ['obliques'],  exerciseCount: { min: 3, max: 4 }, instructions: '3-4 Oblique 1 cable strap exercises',              isWarmup: false, hasCardioBurst: false },
      { blockId: 'b5', name: 'Oblique Cable Block 2',   templateTags: ['obliques'],  exerciseCount: { min: 3, max: 4 }, instructions: '3-4 Oblique 2 cable strap exercises',              isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Long Black Cable Block',  templateTags: ['upper_body'], exerciseCount: { min: 3, max: 3 }, instructions: 'Long Black cable focused',                        isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Leg Cable Block 1',       templateTags: ['lower_body'], exerciseCount: { min: 3, max: 3 }, instructions: '3 exercises (min 1 lunge)',                        isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Leg Cable Block 2',       templateTags: ['lower_body'], exerciseCount: { min: 3, max: 3 }, instructions: '3 exercises (min 1 lunge)',                        isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Cable Core Block',        templateTags: ['core'],      exerciseCount: { min: 3, max: 3 }, instructions: 'Cable core block',                                isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Core Block',       templateTags: ['core'],      exerciseCount: { min: 2, max: 3 }, instructions: 'Ending core block (planks/cardio bursts)',         isWarmup: false, hasCardioBurst: true },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-power-round',
    name: 'Power Round',
    description: 'High-intensity workout combining strength exercises with cardio bursts for endurance',
    accentColor: '0,183,120',     // teal
    icon: '🔥',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Core/Cardio Warmup',       templateTags: ['core'],           exerciseCount: { min: 5, max: 6 }, instructions: '5-6 exercises core / min 2 cardio burst warm up',          isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b7', name: 'Heavy Bilateral Warmup',    templateTags: ['heavy_bilateral'], exerciseCount: { min: 1, max: 1 }, instructions: '1 Heavy bilateral warmup. Ex: Superhero, Bridge Press',   isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Heavy Legs',                templateTags: ['heavy_pressing'],  exerciseCount: { min: 3, max: 3 }, instructions: '3 heavy legs',                                            isWarmup: false, hasCardioBurst: false },
      { blockId: 'b7', name: 'Power Round',               templateTags: ['power_round'],     exerciseCount: { min: 1, max: 2 }, instructions: '1-2 with power round',                                    isWarmup: false, hasCardioBurst: true },
      { blockId: 'b1', name: 'Core with Cardio',          templateTags: ['core'],           exerciseCount: { min: 3, max: 3 }, instructions: 'Core block with cardio bursts in between legs',           isWarmup: false, hasCardioBurst: true },
      { blockId: 'b2', name: 'Leg Block 2',               templateTags: ['lower_body'],      exerciseCount: { min: 2, max: 2 }, instructions: 'Leg Block 2',                                             isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Upper Body with Cardio',    templateTags: ['upper_body'],      exerciseCount: { min: 5, max: 5 }, instructions: '5 exercises + cardio bursts',                              isWarmup: false, hasCardioBurst: true },
      { blockId: 'b1', name: 'Ending Core with Cardio',   templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending core block with min 2 cardio bursts',              isWarmup: false, hasCardioBurst: true },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-stacked-anterior',
    name: 'Stacked - Anterior Day',
    description: 'Targeted workout for the front of the body, emphasizing chest, abs, and quads',
    accentColor: '0,183,120',     // teal
    icon: '🎯',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Anterior Core Warmup',   templateTags: ['core'],            exerciseCount: { min: 4, max: 5 }, instructions: '5 anterior core exercises with cardio burst warm up',   isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b2', name: 'Quad Focus Warmup',       templateTags: ['heavy_bilateral'], exerciseCount: { min: 1, max: 1 }, instructions: 'Heavy bilateral warmup focusing on quads',              isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Heavy Anterior Legs',     templateTags: ['heavy_pressing'],  exerciseCount: { min: 2, max: 3 }, instructions: 'Heavy anterior chain leg exercises',                    isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Anterior Footstrap',      templateTags: ['footstrap'],      exerciseCount: { min: 1, max: 2 }, instructions: 'Footstrap moves targeting front body',                  isWarmup: false, hasCardioBurst: false },
      { blockId: 'b7', name: 'Light Anterior Work',     templateTags: ['light_resistance'],exerciseCount: { min: 1, max: 2 }, instructions: 'Light anterior chain work - lunges, knee drives',       isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Heavy Chest/Shoulders',   templateTags: ['heavy_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Heavy chest and shoulder focus',                        isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Light Anterior Upper Body',templateTags: ['light_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Light anterior upper body work',                       isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Anterior Bodyweight',     templateTags: ['bodyweight'],     exerciseCount: { min: 1, max: 2 }, instructions: 'Bodyweight exercises targeting front body',              isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Anterior Core',    templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending core block focusing on abs and anterior chain',  isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-stacked-posterior',
    name: 'Stacked - Posterior Day',
    description: 'Focused on the back of the body, strengthening back, glutes, and hamstrings',
    accentColor: '0,183,120',     // teal
    icon: '🔄',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Posterior Core Warmup',     templateTags: ['core'],            exerciseCount: { min: 4, max: 5 }, instructions: '5 posterior core exercises with cardio burst warm up',     isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b2', name: 'Posterior Chain Warmup',     templateTags: ['heavy_bilateral'], exerciseCount: { min: 1, max: 1 }, instructions: 'Heavy bilateral warmup focusing on glutes/hamstrings',    isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Heavy Posterior Legs',       templateTags: ['heavy_pressing'],  exerciseCount: { min: 2, max: 3 }, instructions: 'Heavy posterior chain leg exercises',                      isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Posterior Footstrap',        templateTags: ['footstrap'],      exerciseCount: { min: 1, max: 2 }, instructions: 'Footstrap moves targeting back body',                      isWarmup: false, hasCardioBurst: false },
      { blockId: 'b7', name: 'Light Posterior Work',       templateTags: ['light_resistance'],exerciseCount: { min: 1, max: 2 }, instructions: 'Light posterior chain work - hamstring curls, glute work', isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Heavy Back/Shoulders',      templateTags: ['heavy_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Heavy back and rear shoulder focus. Ex: Rows, pulls',     isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Light Posterior Upper Body', templateTags: ['light_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Light posterior upper body work',                         isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Posterior Bodyweight',       templateTags: ['bodyweight'],     exerciseCount: { min: 1, max: 2 }, instructions: 'Bodyweight exercises targeting back body',                 isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Posterior Core',      templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending core block focusing on back and posterior chain',  isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
  {
    id: 'tpl-stacked-push-pull',
    name: 'Stacked - Push/Pull Day',
    description: 'Alternating push and pull movements for balanced full-body strength development',
    accentColor: '0,183,120',     // teal
    icon: '↔️',
    isProOnly: true,
    blocks: [
      { blockId: 'b1', name: 'Core Warmup',             templateTags: ['core'],            exerciseCount: { min: 4, max: 5 }, instructions: '5 core exercises alternating flexion/extension with cardio burst', isWarmup: true,  hasCardioBurst: true },
      { blockId: 'b2', name: 'Push/Pull Warmup',         templateTags: ['heavy_bilateral'], exerciseCount: { min: 1, max: 1 }, instructions: 'Heavy bilateral warmup combining push/pull',                      isWarmup: false, hasCardioBurst: false },
      { blockId: 'b2', name: 'Heavy Push Legs',           templateTags: ['heavy_pressing'],  exerciseCount: { min: 2, max: 3 }, instructions: 'Heavy pushing leg exercises',                                     isWarmup: false, hasCardioBurst: false },
      { blockId: 'b3', name: 'Pull Footstrap',            templateTags: ['footstrap'],      exerciseCount: { min: 1, max: 2 }, instructions: 'Footstrap moves emphasizing pulling motion',                      isWarmup: false, hasCardioBurst: false },
      { blockId: 'b7', name: 'Light Push/Pull Legs',      templateTags: ['light_resistance'],exerciseCount: { min: 1, max: 2 }, instructions: 'Light leg work alternating push/pull patterns',                   isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Heavy Push Upper Body',     templateTags: ['heavy_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Heavy pushing upper body. Ex: Chest press, shoulder press',       isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Light Pull Upper Body',     templateTags: ['light_resistance'],exerciseCount: { min: 2, max: 2 }, instructions: 'Light pulling upper body work',                                   isWarmup: false, hasCardioBurst: false },
      { blockId: 'b6', name: 'Push/Pull Bodyweight',      templateTags: ['bodyweight'],     exerciseCount: { min: 1, max: 2 }, instructions: 'Bodyweight exercises alternating push/pull',                       isWarmup: false, hasCardioBurst: false },
      { blockId: 'b1', name: 'Ending Core Push/Pull',     templateTags: ['core'],           exerciseCount: { min: 2, max: 3 }, instructions: 'Ending core block alternating flexion/extension',                 isWarmup: false, hasCardioBurst: false },
    ],
    get estimatedMinutes() { return estimateMinutes(this.blocks); },
  },
];

/** Find a template by ID */
export function getTemplateById(id: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
