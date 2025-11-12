import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;
  return data;
};

export const signUpUser = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: undefined, // No email redirect needed
      data: {
        username: username.trim(),
      },
      // Auto-confirm the user (works if Supabase is configured for auto-confirm)
    },
  });

  if (error) throw error;
  
  // If user is created but not confirmed, try to sign them in immediately
  // This handles the case where auto-confirm is enabled
  if (data.user && !data.session) {
    // Wait a moment for the trigger to confirm the user
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Try to sign in to get the session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    
    if (!signInError && signInData) {
      return signInData;
    }
  }
  
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
};

