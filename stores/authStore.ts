import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, user: data.session?.user ?? null, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize auth", error);
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

