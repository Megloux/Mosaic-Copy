-- Create a named snapshot for our migration
SELECT 
    NOW() as backup_time,
    current_database() as database,
    pg_export_snapshot() as snapshot_id,
    -- Record table sizes before migration
    (SELECT COUNT(*) FROM templates) as template_count,
    (SELECT COUNT(*) FROM routines) as routine_count,
    -- Record current ID patterns
    (SELECT COUNT(*) FROM templates WHERE id::text ~ '^t\d+$') as valid_template_ids,
    (SELECT COUNT(*) FROM routines WHERE id::text ~ '^r\d+$') as valid_routine_ids
INTO backup_metadata;
