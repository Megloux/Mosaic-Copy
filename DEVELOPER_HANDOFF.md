# 🎯 MOSAIC: DEVELOPER HANDOFF DOCUMENT

**Date:** December 29, 2024  
**Project:** Mosaic - The Spotify of Pilates Programming  
**Status:** Exercise Library Complete, Ready for Routine Builder Phase  
**Repository:** https://github.com/Megloux/Mosaic-Copy  
**Branch:** main

---

## 🚀 THE VISION

Mosaic is the **first-of-its-kind Pilates routine builder and player** designed for professional instructors. Think Spotify for workout programming - instructors can create custom routines from a library of 70+ exercises, play them with video guidance and audio cues, and share them with their community.

**The Market Need:**
- Pilates instructors spend 2-3 hours per week manually planning classes
- No existing tool combines exercise library + routine builder + player
- Studios pay $200-500/month for inferior scheduling software
- Instructors want to share routines but have no platform

**The Solution:**
- 70 professionally curated Pilates exercises with video
- Drag-and-drop routine builder with 8 equipment templates
- Video player with timer and audio cues
- Social platform for sharing and discovering routines
- iOS native app for in-studio use

**Target Launch:** 16-18 weeks from now on iOS App Store

---

## 📍 WHERE WE ARE NOW

### ✅ COMPLETED (Last 2 Weeks)

**Exercise Library - FULLY FUNCTIONAL**
- ✅ 70 Pilates exercises migrated from screenshots to production code
- ✅ 7 categories implemented (Abs, Obliques, Lower Body Heavy, Lower Body LSD, Lower Body Straps, Upper Body, Cardio Bursts)
- ✅ Template tags applied to all exercises for programmatic filtering
- ✅ Exercise Library UI with search, filtering, and category expansion
- ✅ Exercise detail modal with close button and "Add to Routine" button
- ✅ Design system colors applied (teal branding, no purple)
- ✅ All exercise names display in uppercase
- ✅ Store integration (`exerciseLibraryStore.ts`) with all 7 categories
- ✅ Complete data migration handoff documentation
- ✅ Git workflow established, all changes committed and pushed to GitHub

**What This Means:**
The foundation is SOLID. A new developer can browse 70 exercises, search by name, filter by category, view exercise details with spring setup and timing, and see a polished UI that follows the design system. This is the data layer that powers everything else.

---

## 🏗️ ARCHITECTURE

### **Tech Stack**
- **Frontend:** React 18 + TypeScript 5 + Vite 5
- **Styling:** TailwindCSS 3 + CSS custom properties (design tokens)
- **State Management:** Zustand (lightweight, no boilerplate)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Real-time)
- **iOS:** Capacitor 5 (web app → native iOS)
- **Video:** Vimeo API (video hosting and embedding)
- **Deployment:** Vercel (web) + App Store (iOS)

### **Feature-Slice Architecture (FSA)**
The codebase is transitioning to FSA, which organizes code by feature, not by type.

**Structure:**
```
src/
├── features/           # Feature-specific code
│   ├── exercises/      # Exercise Library feature
│   │   ├── components/ # ExerciseLibrary, ExerciseCard, ExerciseDetail
│   │   ├── model/      # exerciseLibraryStore.ts
│   │   └── types/      # Exercise type definitions
│   ├── routines/       # Routine Builder feature (NEXT TO BUILD)
│   │   ├── ui/         # RoutineBuilder, TemplateSelection, ExerciseSelection
│   │   ├── model/      # routineStore.ts
│   │   └── types/      # Routine type definitions
│   └── auth/           # Authentication feature (NEXT TO BUILD)
├── shared/             # Shared across features
│   ├── ui/             # Reusable UI components (Button, Card, Modal, etc.)
│   ├── lib/            # Utility functions
│   └── api/            # API clients (Supabase, Vimeo)
├── data/               # Data layer
│   └── core/           # Core data (exercises.ts, categories.sql, blocks.sql)
└── app/                # App-level code (routing, global state)
```

**Why FSA?**
- Features are self-contained (easy to understand and modify)
- Clear dependency flow (shared → features → app)
- Scalable (add new features without touching existing ones)
- Team-friendly (multiple developers can work on different features)

### **Design System**
All UI follows a token-based design system defined in `src/styles/tokens/`:

**Colors:** (`colors.css`)
- `--core-black: 0 0 0` (background)
- `--core-white: 255 255 255` (text)
- `--core-teal: 0 183 120` (brand color)
- `--core-teal-light: 0 213 140` (accent)

**Typography:** (`typography.css`)
- Primary font: SF Pro (iOS native)
- Font weights: thin (100) to black (900)
- Exercise names: UPPERCASE

**Spacing:** (`spacing.css`)
- Container padding: sm (12px), md (16px), lg (24px)
- Consistent spacing scale (4px increments)

**Motion:** (`motion.css`)
- Natural duration: 300ms
- Easing: cubic-bezier for smooth animations

**Usage:**
```tsx
// Good - uses design tokens
<div className="bg-[rgb(var(--core-teal))] p-[var(--container-padding-md)]">

// Bad - hardcoded values
<div className="bg-blue-500 p-4">
```

---

## 📂 CRITICAL FILES YOU NEED TO KNOW

### **1. Exercise Data** (`src/data/core/exercises.ts`)
**What:** All 70 exercises with metadata  
**Structure:**
```typescript
export const abs_exercises = {
  e1: {
    id: "e1",
    exercise_name: "ab wheel",
    category_id: "c1",
    setup_instructions: "...",
    movement_notes: "...",
    cueing: "...",
    this_that: "...",
    spring_setup: { light_springs: 2, heavy_springs: 0 },
    template_tags: ["planks"],
    vimeo_id: "123456789",
    standard_time: "1:00"
  },
  // ... 9 more exercises
}
```

**Key Points:**
- 7 category objects: `abs_exercises`, `obliques_exercises`, `lower_body_lsd_exercises`, `lower_body_heavy_exercises`, `upper_body_exercises`, `lower_body_straps_exercises`, `cardio_bursts_exercises`
- Each exercise has a unique ID (e1-e70)
- `template_tags` are used for filtering (e.g., "planks", "cables_rotational")
- `vimeo_id` links to video (not all exercises have videos yet)
- `standard_time` is the default duration (format: "M:SS")

**Naming Convention:**
- SQL: PascalCase (e.g., `CardioBursts`)
- TypeScript variables: snake_case (e.g., `cardio_bursts_exercises`)
- UI display: Title Case with spaces (e.g., "Cardio Bursts")

### **2. Exercise Library Store** (`src/features/exercises/model/exerciseLibraryStore.ts`)
**What:** Zustand store managing exercise library state  
**State:**
```typescript
{
  exercises: Exercise[],        // All 70 exercises
  categories: Category[],        // 7 categories
  selectedCategory: string | null,
  searchQuery: string,
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `fetchExercises()` - Loads all exercises from data files
- `fetchCategories()` - Loads all categories
- `setSearchQuery(query)` - Updates search filter
- `setSelectedCategory(id)` - Updates category filter

**Usage:**
```typescript
const { exercises, categories, searchQuery, setSearchQuery } = useExerciseLibraryStore()
```

### **3. Exercise Library Component** (`src/features/exercises/components/ExerciseLibrary.tsx`)
**What:** Main UI component for browsing exercises  
**Features:**
- Search bar with debounced input
- Category filter pills (All, Abs, Obliques, etc.)
- Expandable category sections
- Grid view of exercise cards
- Click to open exercise detail modal

**Props:**
```typescript
interface ExerciseLibraryProps {
  onAddToRoutineBuilder: (exercise: Exercise) => void  // Callback when user clicks "Add to Routine"
  className?: string
}
```

### **4. Exercise Detail Modal** (`src/features/exercises/components/ExerciseDetail.tsx`)
**What:** Modal showing full exercise details  
**Features:**
- Video thumbnail (or placeholder if no video)
- Exercise name (uppercase)
- Setup & basics card (instructions, spring setup, time)
- Movement & cueing card
- This/That comparison card
- Close button (X) in header
- "Add to Routine" button in header
- Close button at bottom

**Props:**
```typescript
interface ExerciseDetailProps {
  exercise: Exercise
  isOpen: boolean
  onClose: () => void
  onAddToRoutineBuilder: (exercise: Exercise) => void
}
```

### **5. Supabase Configuration** (`src/config/supabase.ts`)
**What:** Supabase client setup  
**Environment Variables:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Current State:** Configured but not actively used yet (no auth, no database queries)

### **6. App Routing** (`src/app/App.tsx`)
**What:** Main app routing with React Router  
**Routes:**
- `/` - Home (placeholder)
- `/exercise-library` - Exercise Library (FUNCTIONAL)
- `/routines` - Routines list (placeholder)
- `/routine-builder` - Routine Builder (NOT BUILT YET)
- `/routine-player/:id` - Routine Player (NOT BUILT YET)

---

## 🎨 DESIGN SYSTEM COMPONENTS

All reusable UI components are in `src/shared/ui/` and follow the design system.

### **Buttons** (`src/shared/ui/buttons/`)
- `StandardButton.tsx` - Primary button with variants (default, outline, ghost)
- `FavoriteButton.tsx` - Heart icon button for favoriting
- `ShareButton.tsx` - Share icon button
- `RemoveButton.tsx` - Trash icon button
- `PublicToggle.tsx` - Toggle for public/private

**Usage:**
```tsx
<StandardButton 
  variant="default" 
  size="default" 
  onClick={handleClick}
  leftIcon={<PlusIcon />}
  enableHaptics={true}
>
  Add to Routine
</StandardButton>
```

### **Cards** (`src/shared/ui/cards/`)
- `Card.tsx` - Container with variants (default, outline, elevated)

**Usage:**
```tsx
<Card variant="outline" padding="medium">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### **Modal** (`src/shared/ui/Modal.tsx`)
- Full-screen overlay modal
- Supports sizes (default, large, fullscreen)
- Close on escape or overlay click
- Haptic feedback support

**Usage:**
```tsx
<Modal open={isOpen} onClose={onClose} size="default">
  <div>Modal content</div>
</Modal>
```

### **Form Components** (`src/shared/ui/form/`)
- `Input.tsx` - Text input with validation states
- `SearchInput.tsx` - Search input with debouncing
- `Select.tsx` - Dropdown select
- `Checkbox.tsx` - Checkbox input
- `Switch.tsx` - Toggle switch

### **Layout Components** (`src/shared/ui/`)
- `Grid.tsx` - Responsive grid layout
- `Section.tsx` - Page section with padding
- `Accordion.tsx` - Expandable sections
- `Tabs.tsx` - Tab navigation

---

## 🔧 DEVELOPMENT SETUP

### **Prerequisites**
- Node.js 18+ (use `nvm` to manage versions)
- macOS (required for iOS development later)
- Git
- VS Code (recommended) or Windsurf IDE

### **First-Time Setup**
```bash
# Clone the repository
git clone https://github.com/Megloux/Mosaic-Copy.git
cd "mosaic copy"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

**Development server runs at:** `http://localhost:5173`

### **Available Scripts**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### **Environment Variables**
Create `.env` file in root:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **Git Workflow**
```bash
# Pull latest changes
git pull origin main

# Create feature branch (optional)
git checkout -b feature/routine-builder

# Make changes, then commit
git add .
git commit -m "feat: Add routine builder component"

# Push to GitHub
git push origin main
```

**Commit Message Convention:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 🚀 IMMEDIATE NEXT STEPS (WEEK 1)

You're starting **Phase 1: Routine Builder + Auth** from the complete roadmap.

### **Day 1-2: Supabase Auth Setup**

**Goal:** Users can sign up and log in

**Tasks:**
1. **Enable Supabase Auth**
   - Go to Supabase dashboard → Authentication → Providers
   - Enable Email/Password provider
   - Configure email templates (welcome, verification, password reset)
   - Enable email confirmation requirement

2. **Create Auth Store** (`src/features/auth/model/authStore.ts`)
   ```typescript
   import { create } from 'zustand'
   import { supabase } from '@/config/supabase'
   
   interface AuthState {
     user: User | null
     session: Session | null
     loading: boolean
     signUp: (email: string, password: string) => Promise<void>
     signIn: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
   }
   
   export const useAuthStore = create<AuthState>((set) => ({
     user: null,
     session: null,
     loading: true,
     signUp: async (email, password) => {
       const { data, error } = await supabase.auth.signUp({ email, password })
       if (error) throw error
       set({ user: data.user, session: data.session })
     },
     signIn: async (email, password) => {
       const { data, error } = await supabase.auth.signInWithPassword({ email, password })
       if (error) throw error
       set({ user: data.user, session: data.session })
     },
     signOut: async () => {
       await supabase.auth.signOut()
       set({ user: null, session: null })
     }
   }))
   ```

3. **Create Login Screen** (`src/features/auth/ui/LoginScreen.tsx`)
   - Email input with validation
   - Password input with show/hide toggle
   - "Sign In" button
   - "Forgot Password?" link
   - "Don't have an account? Sign Up" link
   - Error handling (wrong password, user not found, network error)
   - Loading state

4. **Create Signup Screen** (`src/features/auth/ui/SignupScreen.tsx`)
   - Email input with validation (RFC 5322 compliant)
   - Password input with strength indicator
   - Confirm password input
   - "Sign Up" button
   - "Already have an account? Sign In" link
   - Password requirements:
     - Minimum 8 characters
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number
     - At least one special character

5. **Add Auth Routes** (`src/app/App.tsx`)
   ```tsx
   <Route path="/login" element={<LoginScreen />} />
   <Route path="/signup" element={<SignupScreen />} />
   ```

6. **Protect Routes**
   - Create `ProtectedRoute` component
   - Redirect to login if not authenticated
   - Apply to `/routine-builder`, `/routines`, etc.

**Success Criteria:**
- ✅ User can sign up with email/password
- ✅ User receives verification email
- ✅ User can log in after verification
- ✅ User is redirected to home after login
- ✅ Protected routes redirect to login if not authenticated

### **Day 3: Database Schema**

**Goal:** Database tables created with proper relationships

**Tasks:**
1. **Create Migration** (`supabase/migrations/00004_add_routines.sql`)
   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE public.users (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     email TEXT NOT NULL,
     name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Routines table
   CREATE TABLE public.routines (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     template_type TEXT NOT NULL, -- 'reformer', 'tower', 'mat', etc.
     difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
     total_duration INTEGER, -- in seconds
     is_public BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Blocks table (4 blocks per routine)
   CREATE TABLE public.blocks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
     block_type TEXT NOT NULL, -- 'warmup', 'work', 'cardio', 'cooldown'
     block_order INTEGER NOT NULL, -- 1, 2, 3, 4
     duration INTEGER, -- in seconds
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Routine Exercises table (exercises within blocks)
   CREATE TABLE public.routine_exercises (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
     exercise_id TEXT NOT NULL, -- 'e1', 'e2', etc. (references exercises.ts)
     exercise_order INTEGER NOT NULL,
     duration INTEGER, -- in seconds (can override standard_time)
     notes TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Indexes for performance
   CREATE INDEX idx_routines_user_id ON public.routines(user_id);
   CREATE INDEX idx_blocks_routine_id ON public.blocks(routine_id);
   CREATE INDEX idx_routine_exercises_block_id ON public.routine_exercises(block_id);
   
   -- Row Level Security (RLS) policies
   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
   
   -- Users can only see their own data
   CREATE POLICY "Users can view own data" ON public.users
     FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own data" ON public.users
     FOR UPDATE USING (auth.uid() = id);
   
   -- Users can view their own routines + public routines
   CREATE POLICY "Users can view own routines" ON public.routines
     FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
   
   CREATE POLICY "Users can create own routines" ON public.routines
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update own routines" ON public.routines
     FOR UPDATE USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete own routines" ON public.routines
     FOR DELETE USING (auth.uid() = user_id);
   
   -- Similar policies for blocks and routine_exercises
   -- (blocks and routine_exercises inherit permissions from routines)
   ```

2. **Run Migration**
   ```bash
   # In Supabase dashboard: SQL Editor → New Query → Paste migration → Run
   ```

3. **Set Up Automated Backups**
   - Go to Supabase dashboard → Database → Backups
   - Enable daily backups
   - Set retention period (7 days minimum)
   - Document restore procedure in `docs/DATABASE_BACKUP.md`

**Success Criteria:**
- ✅ All tables created
- ✅ RLS policies applied
- ✅ Indexes created
- ✅ Automated backups enabled
- ✅ Test queries work

### **Day 4-5: Routine Store**

**Goal:** State management for routine creation

**Tasks:**
1. **Create Routine Store** (`src/features/routines/model/routineStore.ts`)
   ```typescript
   import { create } from 'zustand'
   import { supabase } from '@/config/supabase'
   
   interface Block {
     id: string
     block_type: 'warmup' | 'work' | 'cardio' | 'cooldown'
     block_order: number
     exercises: Exercise[]
   }
   
   interface Routine {
     id: string
     name: string
     description: string
     template_type: string
     blocks: Block[]
     total_duration: number
   }
   
   interface RoutineState {
     currentRoutine: Routine | null
     routines: Routine[]
     loading: boolean
     createRoutine: (template: string) => void
     addExerciseToBlock: (blockId: string, exercise: Exercise) => void
     removeExerciseFromBlock: (blockId: string, exerciseId: string) => void
     saveRoutine: () => Promise<void>
     loadRoutines: () => Promise<void>
   }
   
   export const useRoutineStore = create<RoutineState>((set, get) => ({
     currentRoutine: null,
     routines: [],
     loading: false,
     
     createRoutine: (template) => {
       const newRoutine = {
         id: crypto.randomUUID(),
         name: 'Untitled Routine',
         description: '',
         template_type: template,
         blocks: [
           { id: crypto.randomUUID(), block_type: 'warmup', block_order: 1, exercises: [] },
           { id: crypto.randomUUID(), block_type: 'work', block_order: 2, exercises: [] },
           { id: crypto.randomUUID(), block_type: 'cardio', block_order: 3, exercises: [] },
           { id: crypto.randomUUID(), block_type: 'cooldown', block_order: 4, exercises: [] }
         ],
         total_duration: 0
       }
       set({ currentRoutine: newRoutine })
     },
     
     addExerciseToBlock: (blockId, exercise) => {
       const { currentRoutine } = get()
       if (!currentRoutine) return
       
       const updatedBlocks = currentRoutine.blocks.map(block => {
         if (block.id === blockId) {
           return { ...block, exercises: [...block.exercises, exercise] }
         }
         return block
       })
       
       set({ currentRoutine: { ...currentRoutine, blocks: updatedBlocks } })
     },
     
     saveRoutine: async () => {
       const { currentRoutine } = get()
       if (!currentRoutine) return
       
       set({ loading: true })
       
       // Save to Supabase
       const { data: routineData, error: routineError } = await supabase
         .from('routines')
         .insert({
           name: currentRoutine.name,
           description: currentRoutine.description,
           template_type: currentRoutine.template_type,
           total_duration: currentRoutine.total_duration
         })
         .select()
         .single()
       
       if (routineError) throw routineError
       
       // Save blocks
       for (const block of currentRoutine.blocks) {
         const { data: blockData, error: blockError } = await supabase
           .from('blocks')
           .insert({
             routine_id: routineData.id,
             block_type: block.block_type,
             block_order: block.block_order
           })
           .select()
           .single()
         
         if (blockError) throw blockError
         
         // Save exercises
         for (let i = 0; i < block.exercises.length; i++) {
           await supabase.from('routine_exercises').insert({
             block_id: blockData.id,
             exercise_id: block.exercises[i].id,
             exercise_order: i + 1
           })
         }
       }
       
       set({ loading: false })
     },
     
     loadRoutines: async () => {
       set({ loading: true })
       
       const { data, error } = await supabase
         .from('routines')
         .select('*, blocks(*, routine_exercises(*))')
         .order('created_at', { ascending: false })
       
       if (error) throw error
       
       set({ routines: data, loading: false })
     }
   }))
   ```

**Success Criteria:**
- ✅ Can create new routine with 4 blocks
- ✅ Can add exercises to blocks
- ✅ Can remove exercises from blocks
- ✅ Can save routine to Supabase
- ✅ Can load routines from Supabase

---

## 📚 KEY DOCUMENTATION

All documentation is in the `docs/` folder:

1. **`EXERCISE_LIBRARY_DATA_MIGRATION_HANDOFF.md`**
   - Complete exercise data migration details
   - Category breakdown
   - Template tags explanation
   - Success criteria

2. **`MOSAIC_TO_APP_STORE_ROADMAP_COMPLETE.md`**
   - 16-18 week timeline to App Store launch
   - All 7 phases with detailed tasks
   - Complete technical requirements
   - Security, compliance, and legal requirements
   - Cost breakdown
   - Risk factors and mitigation

3. **`COMPONENT_HANDOFF.md`**
   - UI component library documentation
   - Design system guidelines
   - Component usage examples

4. **`MOSAIC_MVP_BUILD_UNBLOCK_HANDOFF.md`**
   - FSA migration status
   - Stubbed components inventory
   - Restoration roadmap

---

## 🎯 SUCCESS METRICS

### **Week 1 Goals**
- ✅ User can sign up and log in
- ✅ Database schema created
- ✅ Routine store implemented
- ✅ Can create routine with 4 blocks

### **Week 2 Goals**
- ✅ Template selection UI built
- ✅ Exercise selection UI built
- ✅ Can add exercises to blocks
- ✅ Can save routine to database

### **Phase 1 Complete (Week 2)**
- ✅ User can create account
- ✅ User can create routine from template
- ✅ User can add exercises to blocks
- ✅ User can save routine
- ✅ User can view saved routines

---

## 🚨 CRITICAL KNOWLEDGE

### **1. Supabase RLS Policies**
Row Level Security (RLS) is CRITICAL. Without it, users can see each other's data.

**Always test RLS:**
```sql
-- Test as authenticated user
SELECT * FROM routines WHERE user_id = auth.uid();

-- Should return only user's routines
```

### **2. Exercise IDs**
Exercise IDs (e1-e70) are the source of truth. They link:
- `exercises.ts` (data file)
- `routine_exercises` table (database)
- Exercise Library UI

**Never change exercise IDs** - it will break existing routines.

### **3. Template Types**
8 equipment templates:
- `reformer` - Reformer
- `tower` - Tower
- `mat` - Mat
- `chair` - Chair
- `barrel` - Barrel
- `cadillac` - Cadillac
- `springboard` - Springboard
- `barre` - Barre

Each template has different exercise availability (e.g., mat doesn't use springs).

### **4. Block Types**
4 blocks per routine (fixed order):
1. `warmup` - Warm-up (5-10 min)
2. `work` - Main work (20-30 min)
3. `cardio` - Cardio burst (5-10 min)
4. `cooldown` - Cool-down (5-10 min)

**Block rules:**
- Minimum 1 exercise per block
- Maximum 10 exercises per block
- Total routine duration: 30-60 minutes

### **5. Vimeo Integration**
Videos are hosted on Vimeo. Each exercise has a `vimeo_id`.

**Vimeo API rate limit:** 1000 requests/hour

**To embed video:**
```tsx
<iframe
  src={`https://player.vimeo.com/video/${exercise.vimeo_id}`}
  width="640"
  height="360"
  frameBorder="0"
  allow="autoplay; fullscreen"
  allowFullScreen
/>
```

**Not all exercises have videos yet** - show placeholder if `vimeo_id` is empty.

### **6. Design System Tokens**
Always use CSS custom properties, never hardcoded values:

```tsx
// ✅ Good
<div className="bg-[rgb(var(--core-teal))]">

// ❌ Bad
<div className="bg-teal-500">
```

### **7. Git Workflow**
- Always pull before starting work: `git pull origin main`
- Commit frequently with descriptive messages
- Push at end of day: `git push origin main`
- Never commit `.env` file (it's in `.gitignore`)

---

## 🔥 COMMON PITFALLS TO AVOID

### **1. Not Testing RLS Policies**
**Problem:** Users can see each other's data  
**Solution:** Test every query with `auth.uid()` filter

### **2. Hardcoding Values**
**Problem:** Inconsistent UI, hard to maintain  
**Solution:** Use design tokens and constants

### **3. Not Handling Loading States**
**Problem:** UI freezes, user thinks app is broken  
**Solution:** Show loading spinner for all async operations

### **4. Not Handling Errors**
**Problem:** App crashes, user sees blank screen  
**Solution:** Use try/catch, show error messages

### **5. Forgetting to Update Store**
**Problem:** UI doesn't reflect data changes  
**Solution:** Always call `set()` in Zustand actions

### **6. Not Validating User Input**
**Problem:** Bad data in database, security vulnerabilities  
**Solution:** Validate on client AND server (Supabase RLS)

### **7. Not Testing on Real Devices**
**Problem:** App works on desktop, breaks on iPhone  
**Solution:** Test on iOS simulator early and often

---

## 💪 YOU'VE GOT THIS

**What's Already Done:**
- ✅ 70 exercises migrated (hardest part)
- ✅ Exercise Library UI (polished and functional)
- ✅ Design system (consistent and scalable)
- ✅ Architecture (FSA, clean and maintainable)
- ✅ Git workflow (professional and documented)

**What You're Building Next:**
- 🔨 Authentication (users can sign up and log in)
- 🔨 Routine Builder (users can create custom routines)
- 🔨 Database integration (routines saved to Supabase)

**Why This Will Work:**
- The foundation is SOLID
- The roadmap is COMPLETE
- The architecture is SCALABLE
- The vision is CLEAR

**You're not starting from scratch. You're building on a strong foundation.**

---

## 📞 QUESTIONS TO ANSWER THIS WEEK

Before you start coding, answer these:

1. **Block Timing Rules:**
   - What's the minimum duration for each block?
   - What's the maximum duration for each block?
   - Can users customize block order?

2. **Exercise Selection:**
   - Can users add the same exercise multiple times?
   - Can users reorder exercises within a block?
   - Should exercises have default durations or user-specified?

3. **Routine Validation:**
   - What's the minimum number of exercises per routine?
   - What's the maximum routine duration?
   - Can users save incomplete routines as drafts?

4. **Template Constraints:**
   - Do different templates allow different exercises?
   - Should mat routines exclude spring-based exercises?
   - Do we need template-specific validation?

**Document your decisions in `docs/ROUTINE_BUILDER_DECISIONS.md`**

---

## 🚀 READY TO BUILD

**Your mission:**
Build the Routine Builder so Pilates instructors can create custom routines in < 5 minutes.

**Your timeline:**
2 weeks to complete Phase 1 (Auth + Routine Builder)

**Your resources:**
- This handoff document
- Complete roadmap (`MOSAIC_TO_APP_STORE_ROADMAP_COMPLETE.md`)
- Exercise Library (working reference implementation)
- Design system (all components ready)

**Your support:**
- GitHub repository with all code
- Supabase backend ready
- Documentation for every feature

**Go build something extraordinary.** 💪🔥

---

**Last commit:** December 29, 2024  
**Next milestone:** Routine Builder functional (Week 2)  
**Final goal:** iOS App Store launch (Week 16-18)

**This is Mosaic. This is the future of Pilates programming. Let's make it happen.**
