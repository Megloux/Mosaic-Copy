# Auth Fix Handoff

## Date: June 19, 2026

## What Was Done (Committed)

| Commit | Message | File(s) Changed |
|--------|---------|-----------------|
| `f8c8240` | fix: apply className to inner input in PasswordInput | `src/components/ui/form/PasswordInput.tsx` |
| `9de2479` | fix: distinguish query errors from taken username in signup form | `src/features/auth/components/SignupForm.tsx` |
| `8672caf` | fix: insert profile row directly after signup instead of relying on trigger | `src/features/auth/api/authApi.ts` |
| `0d2a9ae` | fix: visible text color in username and studio name fields | `src/shared/ui/form/Input.tsx` |
| `1b53c1d` | fix: only gate app render on initialized, not loading state | `src/App.tsx` |
| `2d0dc5d` | fix: remove pre-signup username check that was blocking account creation | `src/features/auth/api/authApi.ts` |

All commits are on branch `mosaic-working`.

## Current State of the Problem

Signup still does not work on the live deployed site (dulcet-tarsier-34642f.netlify.app). The user fills out the form, clicks Create Account, and either the form clears with no feedback or an error appears. No row is created in the Supabase `profiles` table.

The dist folder was rebuilt after the last commit and deployed to Netlify.

## What Has NOT Been Verified

- Whether the Supabase database trigger `handle_new_user` / `on_auth_user_created` exists in the live database
- Whether rows are being created in `auth.users` (the user may have accounts in auth.users with no matching profile row)
- Whether the RLS INSERT policy on `profiles` is blocking the client-side upsert (it requires `auth.uid() = id`, which may be null if email confirmation is required)
- Whether Supabase email confirmation is enabled (if yes, there is no session after signUp, and auth.uid() is null)
- Whether the SELECT policy on `profiles` allows unauthenticated reads (needed for username availability check in the form)

## Key Files

- `src/features/auth/api/authApi.ts` — signUp function, profile upsert, checkUsernameAvailable
- `src/features/auth/model/authStore.ts` — Zustand store, signUp action wraps authApi.signUp
- `src/features/auth/components/SignupForm.tsx` — form UI, submit handler, username debounce
- `src/App.tsx` — loading gate (now only gates on `initialized`, not `loading`)
- `src/config/supabase.ts` — Supabase client initialization
- `supabase/migrations/00008_update_profile_trigger.sql` — trigger function that inserts profile row with SECURITY DEFINER

## Architecture Notes

- `authApi.ts` currently has a client-side `.upsert()` into `profiles` after `supabase.auth.signUp()` succeeds (commit `8672caf`)
- The migration file `00008_update_profile_trigger.sql` defines a database trigger that should also create the profile row (runs with SECURITY DEFINER, bypasses RLS)
- It is unknown whether that trigger was ever applied to the live database
- The `cn` function at `src/shared/lib/utils/index.ts` is a naive string join (no tailwind-merge). The one at `src/lib/utils.ts` uses clsx + tailwind-merge. The shared Input component now imports from `src/lib/utils.ts`.

## RLS Policies on profiles (from migration files)

- `Users can view their own profile` — SELECT where `auth.uid() = id`
- `Users can create their own profile` — INSERT with check `auth.uid() = id`
- `Users can update their own profile` — UPDATE where `auth.uid() = id`

There is NO public SELECT policy. This means `checkUsernameAvailable` will fail for unauthenticated users (returns a permission error from Supabase).

## Proposed But Not Executed

A public SELECT policy was discussed but not applied:

```sql
CREATE POLICY "Anyone can check username availability"
  ON profiles
  FOR SELECT
  USING (true);
```

This has not been run against the live database.

## Environment

- Vite + React + TypeScript
- Supabase (auth + postgres)
- Zustand for state management
- TailwindCSS for styling
- Deployed on Netlify (dulcet-tarsier-34642f.netlify.app)
- Node v24.14.1 at /usr/local/bin/node
- Branch: mosaic-working
