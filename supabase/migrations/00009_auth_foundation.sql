-- Migration: Auth foundation hardening
--
-- Plain-English summary for the non-technical reader:
--   1. Makes sure the profiles table has every column the signup form sends.
--   2. Cleans up old/conflicting security rules on profiles and replaces them
--      with three simple rules: you can only see, create, and edit YOUR OWN row.
--   3. Rewrites the function that creates a profile when someone signs up so
--      that a profile problem can never block the account from being created.
--   4. Adds a fast, safe way for the app to check if a username is taken.
--   5. Keeps the "last edited" timestamp on profiles up to date automatically.
--   6. Guarantees no two accounts can share the same username.
--
-- This script is idempotent: it is safe to run more than once.

-- ============================================================
-- 1. Profile columns
--    The signup form collects these fields; make sure the table
--    can store them (skips any that already exist).
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS studio_name text;

-- ============================================================
-- 2. Row-level security (RLS) policies on profiles
--
--    Remove old rules that are either duplicated or unsafe:
--      - "Users can insert own profile" / "Users can update own profile"
--        are older duplicates of the rules recreated below.
--      - "Profiles are viewable by everyone" let ANY visitor read every
--        user's email and phone number — that must go.
--
--    Then (re)create three simple own-row rules.
-- ============================================================
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 3. Signup trigger: create a profile row for each new account
--
--    Runs automatically whenever someone signs up. Copies the extra
--    fields collected on the signup form into their profile row.
--    Two hardening details:
--      - Empty strings are stored as NULL so the data stays clean;
--        usernames are stored lowercased so checks are consistent.
--      - The whole insert is wrapped in an error guard: if anything
--        goes wrong while creating the profile, we log a warning but
--        STILL let the account be created. A profile hiccup must never
--        block someone from signing up.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, username, studio_name)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(trim(NEW.raw_user_meta_data->>'first_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'last_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'phone'), ''),
    lower(NULLIF(trim(NEW.raw_user_meta_data->>'username'), '')),
    NULLIF(trim(NEW.raw_user_meta_data->>'studio_name'), '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a profile row with all signup data when a new user signs up. Runs with elevated privileges to bypass RLS. Failures are logged as warnings and never abort user creation.';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. Username availability check
--
--    The signup form asks "is this username taken?" This function
--    answers yes/no WITHOUT exposing anyone's profile data — it only
--    ever returns true or false. Both signed-in and anonymous users
--    may call it (signup happens before login).
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_username_available(candidate text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = lower(trim(candidate))
  )
$$;

REVOKE ALL ON FUNCTION public.is_username_available(text) FROM public;
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;

-- ============================================================
-- 5. Keep profiles.updated_at current
--
--    Reuses the existing update_updated_at_column() helper so every
--    profile edit automatically refreshes its "last edited" time.
-- ============================================================
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. Unique usernames (case-insensitive)
--
--    A partial unique index: two accounts can never share the same
--    username regardless of capitalization. Rows without a username
--    are ignored so NULLs don't collide.
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON public.profiles (lower(username))
  WHERE username IS NOT NULL;
