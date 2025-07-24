-- Test Suite: Studio Customization System
-- Verifies that the studio customization system works as intended

-- 1. Test Basic Structure
-- Verify HILI exists as a studio
SELECT EXISTS (
    SELECT 1 FROM studios WHERE id = 's1'
) as hili_exists;

-- 2. Test Simple Customization
-- Add a custom name for Modified Plank
INSERT INTO studio_customizations (
    studio_id, content_type, content_id, custom_name
) VALUES (
    's1', 'exercise', 'e1', 'HILI Modified Plank'
);

-- Verify name resolution works
-- Should show HILI's name for s1, default for others
SELECT 
    COALESCE(sc.custom_name, e.exercise_name) as display_name,
    e.exercise_name as default_name,
    sc.custom_name as hili_name
FROM exercises e
LEFT JOIN studio_customizations sc 
    ON sc.content_id = e.id 
    AND sc.content_type = 'exercise'
    AND sc.studio_id = 's1'
WHERE e.id = 'e1';

-- 3. Test Complete Workflow
-- Add full customization with video and props
INSERT INTO studio_customizations (
    studio_id, content_type, content_id, 
    custom_name, vimeo_id, custom_data
) VALUES (
    's1', 'exercise', 'e2',
    'HILI Plank Variation',
    'hili_specific_video_id',
    '{"props": ["foam roller", "small ball"]}'::jsonb
);

-- Verify full content resolution
SELECT 
    e.id,
    COALESCE(sc.custom_name, e.exercise_name) as display_name,
    COALESCE(sc.vimeo_id, e.vimeo_id) as video_id,
    sc.custom_data
FROM exercises e
LEFT JOIN studio_customizations sc 
    ON sc.content_id = e.id 
    AND sc.content_type = 'exercise'
    AND sc.studio_id = 's1'
WHERE e.id IN ('e1', 'e2');

-- 4. Verify Timestamps
-- Check that created_at and updated_at are set
SELECT 
    studio_id, content_id, 
    created_at, updated_at
FROM studio_customizations
WHERE studio_id = 's1'
ORDER BY created_at DESC;
