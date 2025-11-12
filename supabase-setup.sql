-- ============================================
-- Framez App - Supabase Database Setup
-- ============================================
-- Run this SQL in your Supabase Dashboard:
-- 1. Go to SQL Editor
-- 2. Click "New Query"
-- 3. Paste this entire file
-- 4. Click "Run" or press Ctrl+Enter
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Create Profiles Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- ============================================
-- 2. Create Posts Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);

-- ============================================
-- 3. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS Policies for Profiles
-- ============================================

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 5. RLS Policies for Posts
-- ============================================

-- Anyone can read posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts
  FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================
-- 6. Create Storage Bucket for Images
-- ============================================
-- Note: You may need to create this manually in Storage section
-- or use the Supabase dashboard UI

INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. Storage Policies for Posts Bucket
-- ============================================

-- Anyone can view images
CREATE POLICY "Anyone can view post images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'posts');

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');

-- Users can update their own images
CREATE POLICY "Users can update their own post images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own images
CREATE POLICY "Users can delete their own post images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- 8. Function to automatically create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Setup Complete!
-- ============================================
-- Your tables are now created with proper RLS policies.
-- Test by:
-- 1. Creating a user account in your app
-- 2. Creating a post
-- 3. Verifying data appears in Supabase dashboard
-- ============================================

