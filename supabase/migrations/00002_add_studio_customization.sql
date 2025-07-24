-- Migration: Add Studio Customization System
-- Adds support for studio-specific exercise names and videos

-- Add initial studio
INSERT INTO studios (id, name) VALUES (uuid_generate_v4(), 'HILI')
ON CONFLICT (id) DO NOTHING;

-- Create customizations table
CREATE TABLE IF NOT EXISTS studio_customizations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid REFERENCES studios(id),
    content_type TEXT,                      -- 'exercise', 'template', etc
    content_id TEXT,                        -- 'e1', 't1' etc
    custom_name TEXT,                       -- NULL = use default
    vimeo_id TEXT,                         -- NULL = use default
    custom_data JSONB DEFAULT '{}'::jsonb,  -- For future customizations
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (studio_id, content_type, content_id)
);

-- Add indexes for common queries
CREATE INDEX idx_studio_customizations_lookup 
ON studio_customizations(studio_id, content_type);

-- Add index for content lookups
CREATE INDEX idx_studio_customizations_content 
ON studio_customizations(content_id, content_type);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_studios_updated_at
    BEFORE UPDATE ON studios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customizations_updated_at
    BEFORE UPDATE ON studio_customizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
