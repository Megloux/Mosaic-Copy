-- Migration: Update profile trigger to read from signup metadata
-- Purpose: Populate profile fields (first_name, last_name, phone, username, studio_name) 
--          from the raw_user_meta_data passed during signup
-- This bypasses RLS issues since the trigger runs with SECURITY DEFINER

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, username, studio_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'studio_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a profile row with all signup data when a new user signs up. Runs with elevated privileges to bypass RLS.';
