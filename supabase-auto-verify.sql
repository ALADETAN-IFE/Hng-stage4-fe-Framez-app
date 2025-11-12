-- ============================================
-- Auto-Verify Users - Remove Email Confirmation
-- ============================================
-- Run this SQL in your Supabase Dashboard SQL Editor
-- This will auto-confirm all new user signups
-- ============================================

-- Update the trigger function to auto-confirm users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user by setting email_confirmed_at
  -- Note: confirmed_at is a generated column that auto-updates based on email_confirmed_at
  UPDATE auth.users
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW())
  WHERE id = NEW.id;

  -- Create profile
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Alternative: Update existing users to be confirmed
-- ============================================
-- Run this if you want to confirm existing unconfirmed users
-- Note: confirmed_at is auto-generated, so we only update email_confirmed_at
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- ============================================
-- Setup Complete!
-- ============================================
-- Now all new users will be auto-confirmed on signup
-- ============================================

