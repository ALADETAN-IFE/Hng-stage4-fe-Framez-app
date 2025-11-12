import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebase";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/(tabs)");
      else router.replace("/signin");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // or splash screen
  return children;
}
