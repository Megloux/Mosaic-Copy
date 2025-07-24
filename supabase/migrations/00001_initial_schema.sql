-- Migration: Initial Schema for Mosaic - The Spotify of Pilates
-- Purpose: Set up the core database structure and future-proof features
-- Author: Cascade AI
-- Date: 2024-02-12

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- For password hashing
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- For text search

--------------------------0------------------------
-- CORE TABLES (Required for MVP)
--------------------------------------------------

-- Studios: Organizations that can have multiple instructors
-- Why: Enables studio subscription model and instructor management
CREATE TABLE studios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles: Extended user information beyond auth.users
-- Why: Stores user-specific data and links to studios
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    is_pro BOOLEAN DEFAULT false,                -- Controls access to pro features
    studio_id uuid REFERENCES studios(id),       -- Optional studio affiliation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories: Pre-defined exercise categories
-- Why: Matches existing category_id format ("c1", "c2") from exercises.ts
CREATE TABLE categories (
    id TEXT PRIMARY KEY,                         -- Using "c1", "c2" format
    name TEXT NOT NULL CHECK (name IN (
        'Abs', 'Obliques', 'LowerBodyHeavyPressing',
        'LowerBodyLungesSquatsDeadlifts', 'LowerBodyStraps',
        'UpperBody', 'Variations'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocks: Core position blocks for workouts
-- Why: Matches block_id format ("b1", "b2") used in templates
CREATE TABLE blocks (
    id TEXT PRIMARY KEY,                         -- Using "b1", "b2" format
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert core block positions
INSERT INTO blocks (id, name) VALUES
    ('b1', 'CenterCore'),
    ('b2', 'RightLeg'),
    ('b3', 'LeftLeg'),
    ('b4', 'RightOblique'),
    ('b5', 'LeftOblique'),
    ('b6', 'UpperBody'),
    ('b7', 'Bilateral');

-- Exercises: Core exercise definitions
-- Why: Exactly matches Exercise interface from exercises.ts
CREATE TABLE exercises (
    id TEXT PRIMARY KEY,                         -- Using "e1", "e2" format
    exercise_name TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id),
    setup_instructions TEXT,
    movement_notes TEXT,
    cueing TEXT,
    this_that TEXT,
    spring_setup JSONB NOT NULL DEFAULT '{"light_springs": 0, "heavy_springs": 0}'::jsonb,
    template_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    vimeo_id TEXT,
    standard_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates: Pre-built workout structures
-- Why: Maintains existing block-based structure from templates.sql
CREATE TABLE templates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    structure JSONB NOT NULL,                    -- Stores block-based workout structure
    is_pro_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_structure CHECK (
        jsonb_typeof(structure->'blocks') = 'array'
    )
);

-- Routines: User-created workouts
-- Why: Allows users to create custom workouts from templates
CREATE TABLE routines (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id),
    template_id uuid REFERENCES templates(id),   -- Optional, if based on template
    name TEXT NOT NULL,
    description TEXT,
    structure JSONB NOT NULL,                    -- Matches template structure
    is_public BOOLEAN DEFAULT false,             -- Only pro users can make public
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine Relationships: Manages routine sharing and favoriting
-- Why: Enables Spotify-like sharing functionality
CREATE TABLE routine_relationships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) NOT NULL,
    routine_id uuid REFERENCES routines(id) NOT NULL,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('owner', 'shared', 'favorited')),
    shared_by uuid REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--------------------------------------------------
-- FUTURE FEATURE TABLES (Pre-implemented for scalability)
--------------------------------------------------

-- Engagement Metrics: Track user interaction with content
-- Why: Future analytics and recommendations
CREATE TABLE engagement_metrics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id),
    content_type TEXT NOT NULL CHECK (content_type IN ('exercise', 'routine', 'template')),
    content_id TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('view', 'complete', 'favorite', 'share')),
    duration_seconds INTEGER,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis: Automated routine analysis
-- Why: Future AI-powered insights and recommendations
CREATE TABLE routine_analysis (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id uuid REFERENCES routines(id) ON DELETE CASCADE,
    overview TEXT,                               -- AI-generated routine summary
    opportunities TEXT[],                        -- Improvement suggestions
    muscle_focus_analysis JSONB,                 -- Muscle group distribution
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Annotations: User notes and modifications
-- Why: Future feature for personalization
CREATE TABLE content_annotations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id),
    content_type TEXT NOT NULL CHECK (content_type IN ('exercise', 'routine')),
    content_id TEXT NOT NULL,
    annotation_type TEXT NOT NULL CHECK (annotation_type IN ('note', 'modification')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

--------------------------------------------------
-- SECURITY POLICIES
--------------------------------------------------

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_annotations ENABLE ROW LEVEL SECURITY;

-- Profile Security
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Routine Security
CREATE POLICY "Users can manage their own routines"
    ON routines FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Pro users can view public routines"
    ON routines FOR SELECT
    USING (
        is_public = true 
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_pro = true
        )
    );

-- Studio Access
CREATE POLICY "Studio members can view studio content"
    ON routines FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles viewer
            WHERE viewer.id = auth.uid()
            AND viewer.studio_id = (
                SELECT creator.studio_id 
                FROM profiles creator 
                WHERE creator.id = routines.user_id
            )
        )
    );

--------------------------------------------------
-- INDEXES (For Performance)
--------------------------------------------------

CREATE INDEX idx_exercise_category ON exercises(category_id);
CREATE INDEX idx_routine_template ON routines(template_id);
CREATE INDEX idx_routine_user ON routines(user_id);
CREATE INDEX idx_engagement_user ON engagement_metrics(user_id, content_type);
CREATE INDEX idx_routine_analysis ON routine_analysis(routine_id);
CREATE INDEX idx_routine_relationships_user ON routine_relationships(user_id);
CREATE INDEX idx_routine_relationships_routine ON routine_relationships(routine_id);
CREATE INDEX idx_routine_relationships_type ON routine_relationships(relationship_type);

-- Full Text Search
CREATE INDEX idx_exercise_name_search ON exercises USING gin(exercise_name gin_trgm_ops);
CREATE INDEX idx_routine_name_search ON routines USING gin(name gin_trgm_ops);

COMMENT ON TABLE studios IS 'Organizations that can have multiple instructors';
COMMENT ON TABLE profiles IS 'Extended user information and preferences';
COMMENT ON TABLE exercises IS 'Core exercise definitions matching exercises.ts interface';
COMMENT ON TABLE templates IS 'Pre-built workout structures';
COMMENT ON TABLE routines IS 'User-created custom workouts';
COMMENT ON TABLE engagement_metrics IS 'Future: Track user interaction with content';
COMMENT ON TABLE routine_analysis IS 'Future: AI-powered workout analysis';
COMMENT ON TABLE content_annotations IS 'Future: User notes and modifications';
