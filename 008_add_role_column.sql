-- Add role column to profiles table for admin access control
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Add check constraint to ensure valid role values
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- Create index on role for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create a policy to allow admins to select all profiles
DROP POLICY IF EXISTS "admins_select_all" ON public.profiles;
CREATE POLICY "admins_select_all" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create admin read policies for other tables
DROP POLICY IF EXISTS "admins_select_all_signals" ON public.signals;
CREATE POLICY "admins_select_all_signals" ON public.signals FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "admins_select_all_strategies" ON public.strategies;
CREATE POLICY "admins_select_all_strategies" ON public.strategies FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
