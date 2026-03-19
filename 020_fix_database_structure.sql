-- ============================================================
-- FIX DATABASE STRUCTURE
-- 1. Add wizard_completed column to profiles
-- 2. Fix recursive RLS policies on profiles
-- 3. Create notification_preferences table
-- 4. Add full_name, timezone columns to profiles
-- ============================================================

-- 1. Add wizard_completed column (will migrate from onboarding_complete)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wizard_completed boolean DEFAULT false;

-- Copy existing onboarding_complete values to wizard_completed
UPDATE public.profiles 
SET wizard_completed = COALESCE(onboarding_complete, false)
WHERE wizard_completed IS NULL OR wizard_completed = false;

-- Add full_name column if not exists (we have 'name' but spec says 'full_name')
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- Copy name to full_name for existing records
UPDATE public.profiles SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;

-- Add timezone column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/New_York';

-- Add plan column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'Free';

-- Add account_status column  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'Active';

-- 2. Fix recursive RLS policies on profiles
-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "admins_select_all" ON public.profiles;

-- Recreate profiles policies with simple non-recursive logic
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Simple policies that only check auth.uid() = id (no subqueries)
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- 3. Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  dashboard_enabled boolean DEFAULT true,
  telegram_enabled boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_preferences
DROP POLICY IF EXISTS "notification_preferences_select_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "notification_preferences_insert_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "notification_preferences_update_own" ON public.notification_preferences;

CREATE POLICY "notification_preferences_select_own" ON public.notification_preferences 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notification_preferences_insert_own" ON public.notification_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_preferences_update_own" ON public.notification_preferences 
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Update handle_new_user trigger to also create notification_preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, name, wizard_completed)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', NULL),
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', NULL),
    false
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- 5. Add name column to strategies table (required by spec)
ALTER TABLE public.strategies ADD COLUMN IF NOT EXISTS name text;

-- Set default name for existing strategies
UPDATE public.strategies 
SET name = COALESCE(
  bundle_name, 
  CONCAT(asset, ' ', setup_preference, ' Strategy')
)
WHERE name IS NULL;

-- Make name NOT NULL with a default
ALTER TABLE public.strategies ALTER COLUMN name SET DEFAULT 'My Strategy';
