-- Migration file for variations
-- This adds the variations table and data to the Supabase database

-- Create the variation_categories table
CREATE TABLE IF NOT EXISTS variation_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Create the variations table
CREATE TABLE IF NOT EXISTS variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variation_name TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES variation_categories(id),
    setup_instructions TEXT NOT NULL,
    movement_notes TEXT NOT NULL,
    cueing TEXT NOT NULL,
    this_that TEXT NOT NULL,
    spring_setup JSONB NOT NULL,
    template_tags TEXT[] DEFAULT '{}',
    vimeo_id TEXT DEFAULT '',
    standard_time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert variation categories
INSERT INTO variation_categories (id, name, description)
VALUES
    ('TempoChange', 'Tempo Change', 'Variations that alter the timing and rhythm of exercises'),
    ('ExerciseVariations', 'Exercise Variations', 'Fundamental variations to the exercise form'),
    ('Grip', 'Grip Variations', 'Different hand and arm positions'),
    ('Stance', 'Stance Variations', 'Different foot and leg positions'),
    ('ComboMoves', 'Combination Moves', 'Complex variations combining multiple movements')
ON CONFLICT (id) DO NOTHING;

-- Insert variations
INSERT INTO variations (id, variation_name, category_id, setup_instructions, movement_notes, cueing, this_that, spring_setup, template_tags, vimeo_id, standard_time)
VALUES
    -- TempoChange variations
    (uuid_generate_v4(), 'PowerRound', 'TempoChange', 'Set up as normal for the exercise', 'Perform the exercise with explosive power on the concentric phase and slow control on the eccentric phase', 'Explode up, control down', 'Power up, control down vs. Same pace throughout', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['TempoChange', 'Power'], '', '3-1-3'),
    (uuid_generate_v4(), 'CAndE', 'TempoChange', 'Set up as normal for the exercise', 'Hold at the most challenging point of the exercise for 3 seconds before completing the movement', 'Up, hold, up more', 'Hold and continue vs. Continuous movement', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['TempoChange', 'Isometric'], '', '2-3-2'),
    (uuid_generate_v4(), 'OneFourTempo', 'TempoChange', 'Set up as normal for the exercise', 'Take 1 second on the concentric phase and 4 seconds on the eccentric phase', 'Up for 1, down for 4', 'Slow lowering vs. Same pace throughout', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['TempoChange', 'Eccentric'], '', '1-0-4'),
    
    -- ExerciseVariations
    (uuid_generate_v4(), 'SplitSquat', 'ExerciseVariations', 'Position one foot forward and one foot back, hip-width apart', 'Lower straight down keeping front knee over ankle', 'Drop straight down between your legs', 'Split stance vs. Parallel feet', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['LowerBody', 'Unilateral'], '', '2-0-2'),
    (uuid_generate_v4(), 'RunnersLunge', 'ExerciseVariations', 'Step one foot forward into a lunge position', 'Push off the front foot to drive the knee up, then return to lunge', 'Drive the knee up with power', 'Dynamic movement vs. Static hold', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['LowerBody', 'Cardio'], '', '1-0-1'),
    (uuid_generate_v4(), 'StaticHold', 'ExerciseVariations', 'Get into position for the exercise', 'Hold the most challenging position without moving', 'Find tension and hold', 'Static vs. Dynamic', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['Isometric'], '', '0-30-0'),
    (uuid_generate_v4(), 'Hinge', 'ExerciseVariations', 'Stand with feet hip-width apart, soft knees', 'Bend forward from the hips keeping back flat', 'Push your hips back', 'Hip hinge vs. Squat', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['LowerBody', 'Posterior'], '', '2-0-2'),
    (uuid_generate_v4(), 'Twist', 'ExerciseVariations', 'Set up as normal for the exercise', 'Add a rotation to the movement pattern', 'Rotate through your center', 'Rotation vs. Linear movement', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['Core', 'Rotation'], '', '2-0-2'),
    
    -- Grip variations
    (uuid_generate_v4(), 'Pronate', 'Grip', 'Turn palms to face down or away from you', 'Maintain pronated grip throughout the movement', 'Palms down', 'Palms down vs. Palms up', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['UpperBody'], '', '2-0-2'),
    (uuid_generate_v4(), 'Supinate', 'Grip', 'Turn palms to face up or toward you', 'Maintain supinated grip throughout the movement', 'Palms up', 'Palms up vs. Palms down', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['UpperBody', 'Biceps'], '', '2-0-2'),
    (uuid_generate_v4(), 'WideArms', 'Grip', 'Place hands wider than shoulder-width apart', 'Maintain wide arm position throughout', 'Reach wide', 'Wide grip vs. Narrow grip', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['UpperBody', 'Chest'], '', '2-0-2'),
    (uuid_generate_v4(), 'TripodArms', 'Grip', 'Create a tripod with thumb and first two fingers', 'Maintain light grip with the tripod shape', 'Light fingertip pressure', 'Tripod grip vs. Full grip', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['UpperBody', 'Grip'], '', '2-0-2'),
    
    -- Stance variations
    (uuid_generate_v4(), 'ToesTurnedOut', 'Stance', 'Position feet with toes pointed outward', 'Maintain external rotation from the hips', 'Turn out from the hips', 'Turned out vs. Parallel', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['LowerBody', 'InnerThigh'], '', '2-0-2'),
    (uuid_generate_v4(), 'Staggered', 'Stance', 'Position one foot slightly in front of the other', 'Keep weight evenly distributed', 'Equal weight on both feet', 'Staggered vs. Parallel', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['LowerBody', 'Balance'], '', '2-0-2'),
    (uuid_generate_v4(), 'WideFeet', 'Stance', 'Position feet wider than hip-width apart', 'Keep toes aligned with knees', 'Push knees wide', 'Wide stance vs. Narrow stance', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['LowerBody', 'InnerThigh'], '', '2-0-2'),
    
    -- ComboMoves
    (uuid_generate_v4(), 'SquatToRow', 'ComboMoves', 'Stand facing the reformer with straps in hands', 'Squat down, then pull the straps as you stand up', 'Squat, then pull', 'Combined movement vs. Isolated movement', '{"light_springs": 1, "heavy_springs": 1}', ARRAY['FullBody', 'Compound'], '', '2-0-2'),
    (uuid_generate_v4(), 'LungeWithTwist', 'ComboMoves', 'Step into a lunge position with arms extended', 'Rotate torso over the front leg', 'Twist over your front knee', 'Lunge with rotation vs. Static lunge', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['FullBody', 'Rotation'], '', '2-0-2'),
    (uuid_generate_v4(), 'BicepCurlToPress', 'ComboMoves', 'Stand with straps in hands, palms up', 'Curl the straps, then rotate palms and press overhead', 'Curl, turn, press', 'Curl to press vs. Isolated curl', '{"light_springs": 2, "heavy_springs": 0}', ARRAY['UpperBody', 'Compound'], '', '2-0-2')
ON CONFLICT (id) DO NOTHING;
