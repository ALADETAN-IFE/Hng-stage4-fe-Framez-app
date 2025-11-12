# Auto-Verify Users Setup Guide

This guide will help you configure Supabase to automatically verify users without requiring email confirmation.

## Method 1: Supabase Dashboard (Recommended)

### Step 1: Disable Email Confirmation
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings** (or **Auth** → **Email Auth**)
3. Find the **"Enable email confirmations"** toggle
4. **Turn it OFF** (disable email confirmations)
5. Click **Save**

### Step 2: Run the SQL Trigger (Optional but Recommended)
1. Go to **SQL Editor** → **New Query**
2. Copy and paste the contents of `supabase-auto-verify.sql`
3. Click **Run**

This will:
- Auto-confirm users when they sign up
- Automatically create their profile
- Ensure immediate authentication

## Method 2: SQL Only

If you prefer to handle everything via SQL:

1. Run `supabase-auto-verify.sql` in the SQL Editor
2. This will update the trigger to auto-confirm users

## What This Does

- **Removes email verification requirement**: Users can sign up and immediately use the app
- **Auto-creates profiles**: The database trigger automatically creates a profile when a user signs up
- **Immediate authentication**: Users are logged in right after signup

## Testing

After setup:
1. Try signing up a new user
2. They should be immediately logged in (no email verification needed)
3. Their profile should be automatically created
4. They should be redirected to the main app

## Notes

- Existing unconfirmed users will remain unconfirmed unless you run the update query in the SQL file
- The trigger function uses `SECURITY DEFINER` to bypass RLS when creating profiles
- Email confirmations can be re-enabled later if needed


