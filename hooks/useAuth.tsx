import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading, initialize, setSession } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.length > 0 && segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/signin");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  if (isLoading) return null;
  return <>{children}</>;
}
