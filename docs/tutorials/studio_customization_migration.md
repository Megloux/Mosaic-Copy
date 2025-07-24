# Mosaic Database Migration Tutorial: Adding Studio Customization and Unilateral Blocks

## Overview
This tutorial walks through the process of adding studio customization support and unilateral block types to the Mosaic database. It covers creating migration files, testing changes, and verifying the results.

## Table of Contents
1. [Understanding the Initial State](#understanding-the-initial-state)
2. [Planning the Changes](#planning-the-changes)
3. [Creating Migration Files](#creating-migration-files)
4. [Testing and Verification](#testing-and-verification)
5. [Common Pitfalls](#common-pitfalls)
6. [Useful Queries](#useful-queries)

## Understanding the Initial State

### Initial Database Structure
The Mosaic database started with these core tables:
- `blocks`: Defines workout section positions (b1-b7)
- `exercises`: Contains exercise definitions
- `templates`: Stores workout templates
- `studios`: Basic studio information

### Key Concepts
- **Blocks**: Represent positions in a workout (e.g., CenterCore, RightLeg)
- **Templates**: Use blocks to organize exercises into sections
- **Exercises**: Stand-alone definitions, independent of blocks

## Planning the Changes

### Requirements
1. Studio Customization
   - Allow studios to customize content
   - Track studio-specific variations
   - Maintain original content integrity

2. Unilateral Support
   - Add SingleArmRight (b8) and SingleArmLeft (b9) blocks
   - Enable template creation with single-arm sections

## Creating Migration Files

### Migration 1: Studio Customization (00002)
```sql
-- File: 00002_add_studio_customization.sql

-- Create studio_customizations table
CREATE TABLE studio_customizations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id uuid REFERENCES studios(id),
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    customization_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_studio_customizations_studio 
ON studio_customizations(studio_id);

CREATE INDEX idx_studio_customizations_content 
ON studio_customizations(content_type, content_id);
```

### Migration 2: Unilateral Blocks (00003)
```sql
-- File: 00003_add_unilateral_blocks.sql

-- Add unilateral blocks
INSERT INTO blocks (id, name) VALUES
    ('b8', 'SingleArmRight'),
    ('b9', 'SingleArmLeft')
ON CONFLICT (id) DO NOTHING;

-- Update blocks name constraint
ALTER TABLE blocks 
DROP CONSTRAINT IF EXISTS blocks_name_check;

ALTER TABLE blocks 
ADD CONSTRAINT blocks_name_check 
CHECK (name IN (
    'CenterCore', 'RightLeg', 'LeftLeg', 'RightOblique', 
    'LeftOblique', 'UpperBody', 'Bilateral',
    'SingleArmRight', 'SingleArmLeft'
));
```

## Testing and Verification

### 1. Check Database Tables
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected output should include:
-- blocks
-- exercises
-- studio_customizations
-- studios
-- templates
-- ...
```

### 2. Verify Blocks
```sql
-- Check all blocks are present
SELECT * FROM blocks ORDER BY id;

-- Expected output:
-- b1 | CenterCore
-- b2 | RightLeg
-- b3 | LeftLeg
-- b4 | RightOblique
-- b5 | LeftOblique
-- b6 | UpperBody
-- b7 | Bilateral
-- b8 | SingleArmRight
-- b9 | SingleArmLeft
```

### 3. Verify Studio Customizations
```sql
-- Check table structure
\d studio_customizations

-- Test insertion
INSERT INTO studio_customizations (
    studio_id,
    content_type,
    content_id,
    customization_data
) VALUES (
    '123e4567-e89b-12d3-a456-426614174000', -- example studio_id
    'exercise',
    'e1',
    '{"custom_name": "Modified Exercise Name"}'::jsonb
);
```

## Common Pitfalls

1. **Exercise Modification Mistake**
   - ❌ Don't modify the exercises table for unilateral support
   - ✅ Unilateral support is handled through blocks in templates

2. **Migration Order**
   - ❌ Don't run migrations out of order
   - ✅ Always run in sequence: 00001 → 00002 → 00003

3. **Constraint Changes**
   - ❌ Don't forget to drop existing constraints before modifying
   - ✅ Use DROP CONSTRAINT IF EXISTS before adding new ones

## Useful Queries

### Check Database State
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blocks';

-- View constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'blocks';
```

### Verify Migrations
```sql
-- Check blocks
SELECT * FROM blocks ORDER BY id;

-- Check studio customizations
SELECT * FROM studio_customizations;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'studio_customizations';
```

### Rollback Queries (if needed)
```sql
-- Rollback unilateral blocks
DELETE FROM blocks WHERE id IN ('b8', 'b9');

-- Rollback studio customizations
DROP TABLE IF EXISTS studio_customizations;
```

## Best Practices

1. **Always Backup First**
   ```sql
   -- Create a backup
   CREATE TABLE blocks_backup AS SELECT * FROM blocks;
   ```

2. **Use IF EXISTS/IF NOT EXISTS**
   ```sql
   -- Safe column addition
   ALTER TABLE exercises 
   ADD COLUMN IF NOT EXISTS new_column TEXT;
   ```

3. **Test in Stages**
   - Run each migration separately
   - Verify after each step
   - Keep rollback queries ready

## Conclusion
This migration added two key features to Mosaic:
1. Studio-specific content customization
2. Unilateral block support for templates

Remember: Changes to the database structure should be well-planned, carefully tested, and properly documented. Always verify your changes and keep backups before major modifications.
