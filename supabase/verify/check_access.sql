-- Verify admin access and table accessibility
SELECT 
    has_table_privilege(current_user, 'templates', 'UPDATE') as can_update_templates,
    has_table_privilege(current_user, 'routines', 'UPDATE') as can_update_routines,
    -- Verify we can read data
    EXISTS(SELECT 1 FROM templates LIMIT 1) as templates_accessible,
    EXISTS(SELECT 1 FROM routines LIMIT 1) as routines_accessible,
    -- Check schema access
    has_schema_privilege(current_user, 'public', 'CREATE') as can_create_tables;
