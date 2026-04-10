import React, { useState, useCallback } from 'react';
import { TemplateGallery } from './TemplateGallery';
import { RoutineBuilderPage } from './RoutineBuilderPage';
import { type TemplateDef } from './templateData';
import {
  BuilderRoutine,
  BuilderBlock,
  createBlankRoutine,
} from './types';

/**
 * RoutineBuilderEntry
 *
 * Top-level page for /builder. Manages the two-screen flow:
 *   1. Template Gallery (pick a template or "start from scratch")
 *   2. Routine Builder (build the routine)
 *
 * Self-contained — no router dependencies, just state transitions.
 */

type Screen = 'gallery' | 'builder';

/** Convert a TemplateDef into a BuilderRoutine with slot placeholders */
function routineFromTemplate(template: TemplateDef): BuilderRoutine {
  const now = Date.now();

  const blocks: BuilderBlock[] = template.blocks.map((b, i) => ({
    id: `b-${now}-${i}`,
    name: b.name,
    type: b.isWarmup ? 'warmup' : 'main',
    exercises: [],
    // Template-mode slot info
    templateTags: b.templateTags,
    slotCount: b.exerciseCount,
    instructions: b.instructions,
    hasCardioBurst: b.hasCardioBurst,
  }));

  return {
    id: `r-${now}`,
    name: template.name,
    mode: 'template',
    templateId: template.id,
    blocks,
    createdAt: new Date().toISOString(),
  };
}

export const RoutineBuilderEntry: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('gallery');
  const [initialRoutine, setInitialRoutine] = useState<BuilderRoutine | null>(null);

  const handleSelectTemplate = useCallback((template: TemplateDef) => {
    setInitialRoutine(routineFromTemplate(template));
    setScreen('builder');
  }, []);

  const handleStartScratch = useCallback(() => {
    setInitialRoutine(createBlankRoutine());
    setScreen('builder');
  }, []);

  const handleBackToGallery = useCallback(() => {
    setScreen('gallery');
    setInitialRoutine(null);
  }, []);

  if (screen === 'builder' && initialRoutine) {
    return (
      <RoutineBuilderPage
        initialRoutine={initialRoutine}
        onBack={handleBackToGallery}
      />
    );
  }

  return (
    <TemplateGallery
      onSelectTemplate={handleSelectTemplate}
      onStartScratch={handleStartScratch}
    />
  );
};
