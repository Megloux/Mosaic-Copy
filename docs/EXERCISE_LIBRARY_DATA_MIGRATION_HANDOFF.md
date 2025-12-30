# Exercise Library Data Migration Handoff

**Date:** December 29, 2024  
**Status:** Data Migration Complete ✅ | UI Integration Pending ⚠️  
**Objective:** Connect migrated exercise data to Exercise Library UI

---

## THE BIG PICTURE: What We're Building

The Exercise Library is the **discovery layer** of Mosaic's three-tier programming ecosystem. It serves as the foundation that enables instructors to find, explore, and select from 70 professionally curated Pilates exercises. Think of it as "the iTunes of Pilates exercises" – a searchable, filterable database that democratizes expert programming.

The Exercise Library provides instructors with instant access to exercises organized into 7 strategic categories (Abs, Obliques, Lower Body Heavy, Lower Body LSD, Footstraps, Upper Body, and Cardio Bursts). Each exercise includes setup instructions, movement cues, spring configurations, duration standards, and video demonstrations. Instructors use this library to discover exercises, which then flow into the Routine Builder where they're assembled into complete workout sequences, and finally into the Routine Player for real-time class execution.

**The data we just migrated is the FOUNDATION of this entire system.** Without accurate, well-structured exercise data, the discovery layer cannot function. Every exercise added to a routine, every filter applied, every search query executed – all of it depends on the 70 exercises we've just migrated from screenshots into the TypeScript data structure. This handoff document bridges what was completed (data migration) with what comes next (UI integration and testing).

---

## WHAT WAS COMPLETED: Exercise Data Migration

### Files Modified

**1. `/Users/meganbowen/CascadeProjects/mosaic copy/src/data/core/exercises.ts`**
- Replaced all placeholder exercise data with 70 real Pilates exercises
- Updated exercise IDs from e1-e70 (sequential, no gaps)
- Added template_tags to all exercises for programmatic filtering
- Created 7 category objects: `abs_exercises`, `obliques_exercises`, `lower_body_lsd_exercises`, `lower_body_heavy_exercises`, `upper_body_exercises`, `cardio_bursts_exercises`, `lower_body_straps_exercises`
- Updated `getCategoryName()` function to include c7 (Cardio Bursts)
- Updated export statement to include `cardio_bursts_exercises`
- Updated `exercisesMock` array to include all 7 categories in correct order

**2. `/Users/meganbowen/CascadeProjects/mosaic copy/src/data/core/categories.sql`**
- Added c7 as 'CardioBursts' (PascalCase)
- Shifted Variations from c7 to c8
- Now defines 8 categories total (c1-c8)

### Exercise Data

**Total Exercises:** 70  
**Exercise ID Range:** e1 through e70  
**Categories:** 7 (c1 through c7)  
**Data Source:** Migrated from user's exercise screenshots and programming documents

### Category Breakdown

| Category ID | SQL Name (PascalCase) | TypeScript Variable | Display Name | Exercise Count | Exercise IDs |
|---|---|---|---|---|---|
| c1 | Abs | `abs_exercises` | Abs | 10 | e1-e10 |
| c2 | Obliques | `obliques_exercises` | Obliques | 6 | e11-e16 |
| c3 | LowerBodyHeavyPressing | `lower_body_heavy_exercises` | Lower Body Heavy | 10 | e30-e39 |
| c4 | LowerBodyLungesSquatsDeadlifts | `lower_body_lsd_exercises` | Lower Body LSD | 13 | e17-e29 |
| c5 | LowerBodyStraps | `lower_body_straps_exercises` | Lower Body Straps | 2 | e63-e64 |
| c6 | UpperBody | `upper_body_exercises` | Upper Body | 23 | e40-e62 |
| c7 | CardioBursts | `cardio_bursts_exercises` | Cardio Bursts | 6 | e65-e70 |

**Note:** Exercise IDs are not strictly sequential by category due to the migration process where cardio exercises were split from footstraps category.

### Template Tags System

Template tags enable programmatic filtering and auto-suggestion when building routines from templates.

**Abs (c1):**
- `planks`
- `supine_cables_crunches`
- `crunches`

**Obliques (c2):**
- `cables_rotational`
- `cables_anti_rotational`

**Lower Body LSD (c4):**
- `lunges_light_springs`
- `squats_and_deadlifts`

**Lower Body Heavy (c3):**
- `heavy_pressing`

**Upper Body (c6):**
- `heavy_pushing`
- `pulling`
- `long_cables`
- `short_cables_heavy`
- `short_cables_light`

**Lower Body Straps (c5):**
- `footstraps`

**Cardio Bursts (c7):**
- `cardio`

### Data Integrity Verified

✅ **No ID conflicts** - All exercise IDs (e1-e70) are unique  
✅ **All exports correct** - All 7 category objects properly exported  
✅ **exercisesMock array properly flattened** - All categories included in correct order  
✅ **getCategoryName function updated** - All 7 categories mapped (c1-c7)  
✅ **Consistent structure** - All exercises follow Exercise interface  
✅ **Template tags applied** - Every exercise has appropriate tags for filtering  

---

## CURRENT STATE: What's Ready

### ✅ Completed

- **Exercise data file (exercises.ts)** is complete and verified
- **All 70 exercises** have proper structure with all required fields
- **Category system** is defined with 7 categories (c1-c7)
- **Export structure** is correct and includes all categories
- **Template tags** are applied for programmatic filtering
- **categories.sql** updated with c7 (CardioBursts) and c8 (Variations)
- **Three naming conventions** properly aligned:
  - SQL: PascalCase (`CardioBursts`)
  - TypeScript: snake_case (`cardio_bursts_exercises`)
  - Display: Title Case with spaces (`Cardio Bursts`)

### ⚠️ Pending

- **Database sync:** Unknown if Supabase categories table needs c7 added
- **Database population:** Unknown if exercises need to be imported into Supabase
- **Data source verification:** Does Exercise Library UI pull from exercises.ts or Supabase?
- **Category filter logic:** Are there hardcoded category assumptions that need updating?
- **UI testing:** Exercise Library has not been tested with new 7-category structure
- **Store verification:** exerciseLibraryStore.ts data flow not yet traced

---

## NEXT STEPS: Getting Exercise Library to Display Data

### CRITICAL QUESTIONS to Answer Before Proceeding

**1. Data Source: Where does the Exercise Library UI get its data?**
- Does it import directly from `exercises.ts`?
- Does it fetch from Supabase `categories` and `exercises` tables?
- Does `exerciseLibraryStore.ts` fetch from Supabase or use local data?
- Is there a service layer (e.g., `ExerciseService.ts`) that handles data fetching?

**2. Category Filtering: How does the UI filter by category?**
- Does it use the 7 category IDs (c1-c7)?
- Are there hardcoded category names or counts anywhere?
- Does the category filter pull from a categories table or is it hardcoded?
- How are category display names generated (from `getCategoryName()` or elsewhere)?

**3. Database Sync: Do we need to update Supabase?**
- Does the Supabase `categories` table need c7 (CardioBursts) added?
- Do all 70 exercises need to be imported into Supabase `exercises` table?
- Is there a migration script or manual SQL import process?
- Or does the app work entirely from local TypeScript files for development?

**4. Template Tags: Are they being used?**
- Does the UI filter by template_tags?
- Is there a "filter by exercise type" feature that uses these tags?
- Are template tags used in the Routine Builder for auto-suggestions?

### ACTION ITEMS (Execute in Order)

**Phase 1: Investigate Data Flow**

1. **Trace exerciseLibraryStore.ts**
   - Open `/Users/meganbowen/CascadeProjects/mosaic copy/src/features/exercises/model/exerciseLibraryStore.ts`
   - Document: Does it import from `exercises.ts` or fetch from Supabase?
   - Document: What methods expose exercise data to components?
   - Document: How does it handle categories?

2. **Trace ExerciseLibrary Component**
   - Open `/Users/meganbowen/CascadeProjects/mosaic copy/src/features/exercises/components/ExerciseLibrary.tsx`
   - Document: How does it get exercise data (from store, props, or direct import)?
   - Document: How does category filtering work?
   - Document: Are there any hardcoded category assumptions?

3. **Check for Service Layer**
   - Look for `/Users/meganbowen/CascadeProjects/mosaic copy/src/services/ExerciseService.ts` or similar
   - Document: Does it exist? Does it fetch from Supabase?
   - Document: What API methods does it expose?

4. **Check Supabase Integration**
   - Open `/Users/meganbowen/CascadeProjects/mosaic copy/src/api/supabase.ts`
   - Document: Are there exercise-related queries?
   - Check Supabase dashboard: Do `categories` and `exercises` tables exist?
   - Document: What's currently in those tables?

**Phase 2: Update Database (if needed)**

5. **Run categories.sql in Supabase**
   - If Supabase is the data source, run updated `categories.sql`
   - Verify c1-c7 exist in `categories` table
   - Verify c8 (Variations) exists if needed

6. **Import exercises into Supabase**
   - If exercises live in database, create import script
   - Map exercises.ts data to Supabase table schema
   - Import all 70 exercises with correct category_id references

**Phase 3: Update UI Components**

7. **Update Category Filters**
   - Find where category filtering happens in ExerciseLibrary.tsx
   - Verify it handles all 7 categories dynamically (not hardcoded)
   - Update any hardcoded category lists or counts
   - Ensure "Cardio Bursts" displays correctly

8. **Update Category Display Logic**
   - Verify `getCategoryName()` is being used for display names
   - Check if there are other places where category names are hardcoded
   - Ensure consistent naming across all UI components

**Phase 4: Test Exercise Library**

9. **Launch Application**
   - Start dev server: `npm run dev`
   - Navigate to Exercise Library page
   - Open browser console for error monitoring

10. **Verify Data Display**
    - ✅ All 70 exercises are visible
    - ✅ Exercise cards render correctly
    - ✅ Exercise details (name, category, spring setup) display
    - ✅ No console errors related to exercise data

11. **Test Category Filtering**
    - ✅ Category filter shows all 7 categories
    - ✅ Clicking each category filters correctly
    - ✅ Exercise counts match expected values
    - ✅ "Cardio Bursts" category works

12. **Test Exercise Details**
    - ✅ Clicking an exercise opens detail modal/view
    - ✅ All exercise fields display correctly
    - ✅ Template tags are visible (if shown in UI)
    - ✅ Spring setup displays correctly

13. **Test Search Functionality**
    - ✅ Search works across all 70 exercises
    - ✅ Search by exercise name works
    - ✅ Search results display correctly
    - ✅ Clearing search restores full list

---

## FILES TO INVESTIGATE NEXT

### Priority 1: Data Flow (Start Here)

**1. `/Users/meganbowen/CascadeProjects/mosaic copy/src/features/exercises/model/exerciseLibraryStore.ts`**
- **What to look for:** How does this store get exercise data?
- **Key questions:**
  - Does it import from `exercises.ts`?
  - Does it fetch from Supabase?
  - What state does it manage?
  - What methods expose data to components?

**2. `/Users/meganbowen/CascadeProjects/mosaic copy/src/features/exercises/components/ExerciseLibrary.tsx`**
- **What to look for:** How does the UI consume exercise data?
- **Key questions:**
  - Does it use exerciseLibraryStore?
  - How does category filtering work?
  - Are there hardcoded category names or counts?
  - How does search work?

### Priority 2: Service Layer

**3. `/Users/meganbowen/CascadeProjects/mosaic copy/src/api/supabase.ts`**
- **What to look for:** Supabase client configuration and queries
- **Key questions:**
  - Are there exercise-related queries defined?
  - How is data fetched from Supabase?
  - Is there error handling?

**4. `/Users/meganbowen/CascadeProjects/mosaic copy/src/services/ExerciseService.ts` (if exists)**
- **What to look for:** Service layer abstracting data access
- **Key questions:**
  - Does it exist?
  - Does it fetch from Supabase or local files?
  - What methods does it expose?

### Priority 3: UI Components

**5. `/Users/meganbowen/CascadeProjects/mosaic copy/src/features/exercises/components/ExerciseCard.tsx`**
- **What to look for:** How individual exercises are rendered
- **Key questions:**
  - What exercise fields does it display?
  - Does it use template_tags?
  - How does it handle missing data?

**6. `/Users/meganbowen/CascadeProjects/mosaic copy/src/features/exercises/components/CategoryFilter.tsx` (if exists)**
- **What to look for:** Category filtering UI
- **Key questions:**
  - Are categories hardcoded or dynamic?
  - Does it use `getCategoryName()`?
  - How many categories does it expect?

---

## SUCCESS CRITERIA

The Exercise Library is working when:

### Data Display
- ✅ All 70 exercises are visible in the UI
- ✅ Exercise cards display correctly with name, category, and spring setup
- ✅ No missing or undefined exercise data
- ✅ Exercise IDs (e1-e70) are properly handled

### Category Filtering
- ✅ Category filter shows all 7 categories
- ✅ Category names display correctly (Abs, Obliques, Lower Body Heavy, Lower Body LSD, Lower Body Straps, Upper Body, Cardio Bursts)
- ✅ Clicking a category filters to only those exercises
- ✅ Exercise counts per category are accurate
- ✅ "Cardio Bursts" category functions identically to others

### Exercise Details
- ✅ Clicking an exercise shows its detail modal/view
- ✅ All fields display: name, setup_instructions, movement_notes, cueing, this_that, spring_setup, standard_time
- ✅ Template tags are visible (if UI shows them)
- ✅ Video placeholder or actual video displays

### Search & Interaction
- ✅ Search functionality works across all exercises
- ✅ Search by exercise name returns correct results
- ✅ Clearing search restores full list
- ✅ No console errors related to exercise data
- ✅ No TypeScript errors in IDE

### Integration Points
- ✅ "Add to Routine" button works (if implemented)
- ✅ Exercise data flows correctly to Routine Builder
- ✅ Template tags enable proper filtering in Routine Builder

---

## RISK FACTORS

### Potential Breaking Points

**1. Hardcoded Category Count**
- **Risk:** UI expects 6 categories, we now have 7
- **Where to check:** ExerciseLibrary.tsx, CategoryFilter component, exerciseLibraryStore.ts
- **Fix:** Make category handling dynamic, not hardcoded

**2. Hardcoded Category Names**
- **Risk:** Category names hardcoded in filters or display logic
- **Where to check:** Any component that displays or filters by category
- **Fix:** Use `getCategoryName()` function consistently

**3. Database Out of Sync**
- **Risk:** Supabase categories table doesn't have c7
- **Where to check:** Supabase dashboard, categories table
- **Fix:** Run updated categories.sql in Supabase

**4. Missing Exercise Data in Database**
- **Risk:** exercises.ts updated but Supabase exercises table not populated
- **Where to check:** Supabase dashboard, exercises table
- **Fix:** Import all 70 exercises into Supabase

**5. Import Path Issues**
- **Risk:** Components importing from wrong path or missing exports
- **Where to check:** Import statements in store and components
- **Fix:** Verify all imports reference correct file paths

**6. Template Tags Not Used**
- **Risk:** Template tags exist but UI doesn't use them
- **Where to check:** Filter components, Routine Builder
- **Fix:** Implement template tag filtering if needed

**7. Exercise ID Gaps**
- **Risk:** UI assumes sequential IDs by category
- **Where to check:** Any code that generates ID ranges
- **Fix:** Use actual exercise objects, not ID assumptions

### If Exercise Library Doesn't Work

**Check these in order:**

1. **Console Errors**
   - Open browser DevTools → Console
   - Look for: Data fetch failures, undefined variables, import errors
   - Document exact error messages

2. **exerciseLibraryStore.ts**
   - Is data loading into the store?
   - Add console.log to verify data structure
   - Check if store methods are being called

3. **Category Filter Logic**
   - Is it expecting 6 categories instead of 7?
   - Are category IDs (c1-c7) handled correctly?
   - Is "Cardio Bursts" missing from filter options?

4. **Supabase Tables**
   - Do categories and exercises tables exist?
   - Are they populated with correct data?
   - Do category_id foreign keys match?

5. **Import Statements**
   - Are all components importing from correct paths?
   - Is `cardio_bursts_exercises` exported and imported?
   - Are there circular dependency issues?

6. **TypeScript Errors**
   - Check IDE for TypeScript errors
   - Verify Exercise interface matches data structure
   - Check for type mismatches in components

---

## TECHNICAL NOTES

### Three Naming Conventions (Intentional)

This project uses three different naming conventions for categories, each serving a specific purpose:

**1. SQL Database (PascalCase)**
```sql
'CardioBursts', 'LowerBodyHeavyPressing', 'UpperBody'
```
- Used in categories.sql and Supabase tables
- No spaces, no underscores
- Database storage format

**2. TypeScript Variables (snake_case)**
```typescript
cardio_bursts_exercises, lower_body_heavy_exercises, upper_body_exercises
```
- Used in exercises.ts for variable names
- JavaScript/TypeScript convention
- All lowercase with underscores

**3. Display Names (Title Case with Spaces)**
```typescript
'Cardio Bursts', 'Lower Body Heavy', 'Upper Body'
```
- Used in getCategoryName() function
- Human-readable format for UI
- Spaces for readability

**All three conventions are properly aligned across the system.**

### Exercise Data Structure

Each exercise follows this TypeScript interface:

```typescript
interface Exercise {
    id: string;                    // e.g., "e1"
    exercise_name: string;         // e.g., "ab wheel"
    category_id: string;           // e.g., "c1"
    setup_instructions: string;
    movement_notes: string;
    cueing: string;
    this_that: string;
    spring_setup: {
        light_springs: number;
        heavy_springs: number;
    };
    template_tags: string[];       // e.g., ["planks", "crunches"]
    vimeo_id: string;
    standard_time: string;         // e.g., "1:00"
}
```

### Category ID Mapping

```
c1 → Abs (10 exercises)
c2 → Obliques (6 exercises)
c3 → Lower Body Heavy (10 exercises)
c4 → Lower Body LSD (13 exercises)
c5 → Lower Body Straps (2 exercises)
c6 → Upper Body (23 exercises)
c7 → Cardio Bursts (6 exercises)
c8 → Variations (future use, no exercises yet)
```

---

## CONTACT & CONTEXT

**Project:** Mosaic - Pilates Programming Platform  
**Component:** Exercise Library (Discovery Layer)  
**Migration Date:** December 29, 2024  
**Data Source:** User's exercise screenshots and programming documents  
**Total Exercises Migrated:** 70  
**Categories Defined:** 7 active (c1-c7), 1 reserved (c8)

**Next Developer Actions:**
1. Trace data flow from exercises.ts → store → UI
2. Verify Supabase sync requirements
3. Test Exercise Library with 7-category structure
4. Document any breaking changes or required updates

**This handoff is complete when:** Exercise Library UI displays all 70 exercises with proper category filtering and no errors.
