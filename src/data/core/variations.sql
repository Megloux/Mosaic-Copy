-- Variation Definitions for Mosaic App
-- Defines all exercise variations with categorized types and instructions

CREATE TABLE IF NOT EXISTS variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variation_name TEXT NOT NULL,
    category_id TEXT NOT NULL,
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

-- Create categories table for variations if it doesn't exist
CREATE TABLE IF NOT EXISTS variation_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert variation categories
INSERT INTO variation_categories (id, name, description) VALUES
    ('v1', 'TempoChange', 'Variations that modify the timing and rhythm of exercises'),
    ('v2', 'ExerciseVariations', 'Alternative positions and forms of standard exercises'),
    ('v3', 'Grip', 'Variations in hand and arm positioning'),
    ('v4', 'Stance', 'Variations in foot and leg positioning'),
    ('v5', 'ComboMoves', 'Combined movements that integrate multiple exercise patterns');

-- Insert variation data
INSERT INTO variations (id, variation_name, category_id, setup_instructions, movement_notes, cueing, this_that, spring_setup, template_tags, vimeo_id, standard_time) VALUES
    -- TempoChange variations
    ('v1', 'PowerRound', 'v1', 'Maintain standard exercise position', 
     'Perform exercise with powerful, explosive movement on concentric phase', 
     'Explode up, control down', 
     'Should feel increased power generation and muscle recruitment',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['power', 'explosive'],
     '',
     '0:45'),
    
    ('v2', 'CAndE', 'v1', 'Maintain standard exercise position', 
     'Contract for 3 counts, extend for 3 counts', 
     'Slow control, feel each phase', 
     'Should feel increased time under tension in both phases',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['tempo', 'control'],
     '',
     '1:00'),
    
    ('v3', 'OneFourTempo', 'v1', 'Maintain standard exercise position', 
     'One count on concentric phase, four counts on eccentric phase', 
     'Quick up, slow down with control', 
     'Should feel increased eccentric control and muscle engagement',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['tempo', 'eccentric'],
     '',
     '0:45'),
    
    -- ExerciseVariations
    ('v4', 'SplitSquat', 'v2', 'One foot forward, one foot back in split stance', 
     'Lower into split squat position while maintaining alignment', 
     'Keep front knee over ankle, back knee toward floor', 
     'Should feel work in front quad and glute, back hip flexor stretch',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['lower_body', 'unilateral'],
     '',
     '0:45'),
    
    ('v5', 'RunnersLunge', 'v2', 'One foot forward in lunge position, back leg extended', 
     'Lower into deep lunge position with back heel lifted', 
     'Stay low, maintain hip alignment', 
     'Should feel deep stretch in hip flexors and work in quads',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['lower_body', 'mobility'],
     '',
     '0:45'),
    
    ('v6', 'StaticHold', 'v2', 'Move to most challenging position of exercise', 
     'Hold position with minimal movement', 
     'Breathe through the hold, maintain engagement', 
     'Should feel increased isometric contraction and stability',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['isometric', 'endurance'],
     '',
     '0:30'),
    
    ('v7', 'Hinge', 'v2', 'Stand with feet hip-width apart', 
     'Bend forward from hips while maintaining flat back', 
     'Push hips back, keep chest lifted', 
     'Should feel stretch in hamstrings and work in posterior chain',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['lower_body', 'posterior_chain'],
     '',
     '0:45'),
    
    ('v8', 'Twist', 'v2', 'Maintain stable base position', 
     'Add rotational movement to standard exercise', 
     'Rotate from core, keep hips stable', 
     'Should feel work in obliques and increased core engagement',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['rotation', 'core'],
     '',
     '0:45'),
    
    -- Grip variations
    ('v9', 'Pronate', 'v3', 'Turn palms down/forward', 
     'Maintain pronated grip throughout exercise', 
     'Keep palms facing down, engage forearms', 
     'Should feel increased work in forearm extensors and different shoulder engagement',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['grip', 'upper_body'],
     '',
     '0:45'),
    
    ('v10', 'Supinate', 'v3', 'Turn palms up/backward', 
     'Maintain supinated grip throughout exercise', 
     'Keep palms facing up, engage biceps', 
     'Should feel increased work in biceps and forearm flexors',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['grip', 'upper_body'],
     '',
     '0:45'),
    
    ('v11', 'WideArms', 'v3', 'Position hands wider than shoulder-width', 
     'Maintain wide arm position throughout exercise', 
     'Keep arms wide, engage chest and shoulders', 
     'Should feel increased work in outer chest and shoulders',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['grip', 'upper_body'],
     '',
     '0:45'),
    
    ('v12', 'TripodArms', 'v3', 'Position hands in tripod grip (thumb and first two fingers)', 
     'Maintain tripod grip throughout exercise', 
     'Engage through fingertips, maintain wrist alignment', 
     'Should feel increased work in forearm stabilizers and grip strength',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['grip', 'stability'],
     '',
     '0:45'),
    
    -- Stance variations
    ('v13', 'ToesTurnedOut', 'v4', 'Position feet with toes turned outward', 
     'Maintain external rotation from hips', 
     'Rotate from hips, keep knees tracking over toes', 
     'Should feel increased work in inner thighs and glute medius',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['stance', 'lower_body'],
     '',
     '0:45'),
    
    ('v14', 'Staggered', 'v4', 'Position one foot slightly ahead of the other', 
     'Maintain staggered stance throughout exercise', 
     'Keep weight evenly distributed, maintain alignment', 
     'Should feel increased stability challenge and core engagement',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['stance', 'balance'],
     '',
     '0:45'),
    
    ('v15', 'WideFeet', 'v4', 'Position feet wider than hip-width apart', 
     'Maintain wide stance throughout exercise', 
     'Press through outer edges of feet, engage inner thighs', 
     'Should feel increased work in inner thighs and different glute engagement',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['stance', 'lower_body'],
     '',
     '0:45'),
    
    -- ComboMoves variations
    ('v16', 'SquatToRow', 'v5', 'Standing position holding straps', 
     'Combine squat with rowing movement', 
     'Squat down, row on the way up', 
     'Should feel full body integration of lower and upper body',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['combo', 'full_body'],
     '',
     '1:00'),
    
    ('v17', 'LungeWithTwist', 'v5', 'Lunge position with rotation capability', 
     'Combine lunge with torso rotation', 
     'Lunge down, rotate toward front leg', 
     'Should feel work in legs and obliques',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['combo', 'rotation'],
     '',
     '1:00'),
    
    ('v18', 'BicepCurlToPress', 'v5', 'Standing position holding straps', 
     'Combine bicep curl with overhead press', 
     'Curl to shoulders, press overhead', 
     'Should feel work in biceps transitioning to shoulders',
     '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
     ARRAY['combo', 'upper_body'],
     '',
     '1:00');

-- Add foreign key constraint
ALTER TABLE variations 
ADD CONSTRAINT fk_variation_category 
FOREIGN KEY (category_id) 
REFERENCES variation_categories(id);
