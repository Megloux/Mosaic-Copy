-- Migration: Add Unilateral Blocks and Update Exercise Types
-- Adds support for unilateral exercises and updates exercise/template structure

-- 1. Add unilateral blocks
INSERT INTO blocks (id, name) VALUES
    ('b8', 'SingleArmRight'),
    ('b9', 'SingleArmLeft')
ON CONFLICT (id) DO NOTHING;

-- 2. Update blocks table to allow new block types
ALTER TABLE blocks 
DROP CONSTRAINT IF EXISTS blocks_name_check;

ALTER TABLE blocks 
ADD CONSTRAINT blocks_name_check 
CHECK (name IN (
    'CenterCore', 'RightLeg', 'LeftLeg', 'RightOblique', 
    'LeftOblique', 'UpperBody', 'Bilateral',
    'SingleArmRight', 'SingleArmLeft'
));

-- 3. Update exercises table for unilateral support
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS unilateral_options JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bilateral_options JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS variations JSONB DEFAULT NULL;

-- 4. Add exercise metadata columns
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS equipment_needed TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS difficulty_level TEXT 
    CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS is_variation_of TEXT REFERENCES exercises(id);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exercises_unilateral 
ON exercises((unilateral_options IS NOT NULL));

CREATE INDEX IF NOT EXISTS idx_exercises_bilateral 
ON exercises((bilateral_options IS NOT NULL));

CREATE INDEX IF NOT EXISTS idx_exercises_difficulty 
ON exercises(difficulty_level);

CREATE INDEX IF NOT EXISTS idx_exercises_variations 
ON exercises(is_variation_of);

-- 6. Update templates table
ALTER TABLE templates
ADD COLUMN IF NOT EXISTS target_level TEXT 
    CHECK (target_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS estimated_duration INTERVAL,
ADD COLUMN IF NOT EXISTS equipment_required TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS variation_options JSONB DEFAULT NULL;
