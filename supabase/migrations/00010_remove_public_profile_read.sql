-- Migration: Remove public read access to profiles
--
-- Plain-English summary:
--   The old rule "Profiles are viewable by everyone" lets ANY visitor,
--   logged in or not, read every user's email and phone number.
--   The app no longer needs it: the signup username check now goes
--   through the is_username_available() function (created in 00009),
--   which only ever answers true/false.
--
-- WHEN TO RUN: only AFTER the auth-foundation code is merged and
-- deployed to the live site. Running it earlier makes the live site's
-- old username check report every username as available.
--
-- This script is idempotent: it is safe to run more than once.

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Proof: expect exactly 3 rows, all restricted to auth.uid() = id
--   INSERT | Users can create their own profile
--   SELECT | Users can view their own profile
--   UPDATE | Users can update their own profile
SELECT policyname, cmd, qual AS using_expr, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY cmd;
