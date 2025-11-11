import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = { name: string; email: string } | null;

type AuthContextShape = {
  user: User;
  loading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading] = useState(false);

  const signIn = async (u: User) => {
    // Replace this with real auth logic (Firebase/Supabase/etc.)
    setUser(u);
  };

  const signOut = () => {
    // Replace with real sign-out logic
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
