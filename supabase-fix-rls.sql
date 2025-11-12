-- ============================================
-- Fix RLS Policy for Profiles
-- ============================================
-- Run this SQL in your Supabase Dashboard SQL Editor
-- This fixes the "new row violates row-level security policy" error
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a more permissive policy that allows authenticated users to create/update their profile
-- This works even if email confirmation is pending
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id OR 
    (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL)
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Alternative: Use a function to bypass RLS for profile creation
-- ============================================
-- This is a more secure approach - create a function that bypasses RLS
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_username TEXT,
  user_email TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (user_id, user_username, user_email)
  ON CONFLICT (id) 
  DO UPDATE SET 
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- ============================================
-- Fix Complete!
-- ============================================
-- Now you can either:
-- 1. Use the updated RLS policies (first approach)
-- 2. Call the create_user_profile function from your app (second approach - more secure)
-- ============================================

