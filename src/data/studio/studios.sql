-- Studios table
CREATE TABLE studios (
    id TEXT PRIMARY KEY,    -- 's1', 's2' format
    name TEXT NOT NULL,     -- Studio names
    settings JSONB         -- Flexible for future needs
);

INSERT INTO studios (id, name) VALUES
    ('s1', 'HILI');

ON CONFLICT (id) DO NOTHING;
