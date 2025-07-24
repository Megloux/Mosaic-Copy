-- Studio customizations table
CREATE TABLE studio_customizations (
    studio_id TEXT REFERENCES studios(id),
    content_type TEXT,     -- 'exercise', 'template', etc
    content_id TEXT,       -- 'e1', 't1' etc
    custom_name TEXT,      -- NULL = use default
    vimeo_id TEXT,        -- NULL = use default
    custom_data JSONB,    -- For future customizations
    PRIMARY KEY (studio_id, content_type, content_id)
);
