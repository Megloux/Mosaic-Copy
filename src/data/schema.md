# Mosaic Schema Documentation

## Naming Conventions
- Table names: snake_case (`blocks`, `categories`, `exercises`)
- Column/field names: snake_case (`exercise_name`, `category_id`)
- Values: PascalCase (`ModifiedPlank`, `CenterCore`, `LowerBodyHeavyPressing`)

## Database Tables

### blocks
- Purpose: Define main workout segments
- Fields:
  - id: UUID (primary key)
  - name: TEXT (e.g., 'CenterCore', 'RightLeg')

### categories
- Purpose: Group exercises by type
- Fields:
  - id: UUID (primary key)
  - name: TEXT (e.g., 'Abs', 'LowerBodyHeavyPressing')

### exercises
- Purpose: Store exercise definitions
- Fields:
  - id: string
  - exercise_name: string
  - category_id: string
  - setup_instructions: string
  - movement_notes: string
  - cueing: string
  - this_that: string
  - spring_setup: {
      light_springs: number,
      heavy_springs: number
    }
  - template_tags: string[]
  - vimeo_id: string
  - standard_time: string
