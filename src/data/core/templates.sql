-- Template Definitions for Mosaic App
-- Defines all workout templates with structured blocks and exercise requirements

CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    structure JSONB NOT NULL,
    is_pro_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template data
INSERT INTO templates (id, name, description, structure, is_pro_only) VALUES
    ('t1', 'Power to Precision', 'Build power through controlled movements, focusing on form and precision in each exercise', 
     '{"blocks": [
        {"block_id": "b1", "name": "Warm-up", "exercises": ["leg_swings", "arm_circles"]}, 
        {"block_id": "b7", "name": "Strength", "exercises": ["squats", "lunges", "deadlifts"]}, 
        {"block_id": "b1", "name": "Cool-down", "exercises": ["stretching"]}
     ]}'::jsonb, true),
    
    ('t2', 'The OG', 'Classic Pilates exercises focusing on fundamental movement patterns and core stability', 
     '{"blocks": [
        {"block_id": "b1", "name": "Core", "exercises": ["plank", "russian_twists"]}, 
        {"block_id": "b6", "name": "Upper Body", "exercises": ["push_ups", "chest_press"]}, 
        {"block_id": "b7", "name": "Lower Body", "exercises": ["leg_press", "calf_raises"]}
     ]}'::jsonb, false),
    
    ('t3', 'Stacked - Anterior Day', 'Targeted workout for the front of the body, emphasizing chest, abs, and quads', 
     '{"blocks": [
        {"block_id": "b6", "name": "Chest", "exercises": ["bench_press", "incline_press"]}, 
        {"block_id": "b1", "name": "Abs", "exercises": ["crunches", "leg_raises"]}, 
        {"block_id": "b2", "name": "Quads", "exercises": ["squats", "leg_press"]},
        {"block_id": "b4", "name": "Right Side Work", "exercises": ["side_plank_right", "side_bend_right"]},
        {"block_id": "b5", "name": "Left Side Work", "exercises": ["side_plank_left", "side_bend_left"]}
     ]}'::jsonb, true),
    
    ('t4', 'Stacked - Posterior Day', 'Focused on the back of the body, strengthening back, glutes, and hamstrings', 
     '{"blocks": [
        {"block_id": "b6", "name": "Back", "exercises": ["pull_ups", "rows"]}, 
        {"block_id": "b7", "name": "Glutes", "exercises": ["deadlifts", "glute_bridges"]}, 
        {"block_id": "b3", "name": "Hamstrings", "exercises": ["leg_curls", "hamstring_press"]}
     ]}'::jsonb, true),
    
    ('t5', 'Stacked - Push/Pull Day', 'Alternating push and pull movements for balanced full-body strength development', 
     '{"blocks": [
        {"block_id": "b6", "name": "Push", "exercises": ["bench_press", "incline_press"]}, 
        {"block_id": "b6", "name": "Pull", "exercises": ["pull_ups", "rows"]}
     ]}'::jsonb, true),
    
    ('t6', 'Cable/Strap Focused', 'Utilizing cables and straps for dynamic resistance training and stability work', 
     '{"blocks": [
        {"block_id": "b6", "name": "Chest", "exercises": ["cable_fly", "cable_press"]}, 
        {"block_id": "b6", "name": "Back", "exercises": ["cable_rows", "cable_lat_pulldowns"]}, 
        {"block_id": "b6", "name": "Shoulders", "exercises": ["cable_lateral_raises", "cable_front_raises"]},
        {"block_id": "b4", "name": "Right Oblique Cable Work", "exercises": ["cable_woodchop_right", "cable_side_bend_right"]},
        {"block_id": "b5", "name": "Left Oblique Cable Work", "exercises": ["cable_woodchop_left", "cable_side_bend_left"]}
     ]}'::jsonb, true),
    
    ('t7', 'Upper Body Focus', 'Concentrated upper body workout incorporating pressing, pulling, and stabilization', 
     '{"blocks": [
        {"block_id": "b6", "name": "Chest", "exercises": ["bench_press", "incline_press"]}, 
        {"block_id": "b6", "name": "Back", "exercises": ["pull_ups", "rows"]}, 
        {"block_id": "b6", "name": "Shoulders", "exercises": ["shoulder_press", "lateral_raises"]}
     ]}'::jsonb, true),
    
    ('t8', 'Lower Body Focus', 'Targeted lower body exercises focusing on strength, stability, and power', 
     '{"blocks": [
        {"block_id": "b2", "name": "Quads", "exercises": ["squats", "leg_press"]}, 
        {"block_id": "b3", "name": "Hamstrings", "exercises": ["leg_curls", "hamstring_press"]}, 
        {"block_id": "b7", "name": "Glutes", "exercises": ["deadlifts", "glute_bridges"]}
     ]}'::jsonb, true),
    
    ('t9', 'Power Round', 'High-intensity workout combining strength exercises with cardio bursts for endurance', 
     '{"blocks": [
        {"block_id": "b1", "name": "Warm-up", "exercises": ["leg_swings", "arm_circles"]}, 
        {"block_id": "b7", "name": "Strength", "exercises": ["squats", "lunges", "deadlifts"]}, 
        {"block_id": "b1", "name": "Cardio", "exercises": ["sprints", "burpees"]}, 
        {"block_id": "b1", "name": "Cool-down", "exercises": ["stretching"]}
     ]}'::jsonb, true);
