import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { auth, db } from "@/lib/firebase";
import { logoutUser } from "@/services/authService";
import { doc, getDoc } from "firebase/firestore";
import type { UserProfile } from "@/services/authService";

export default function AccountScreen() {
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!auth.currentUser) return;
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setUserData(snap.data() as UserProfile);
    };
    loadUser();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {userData && (
        <>
          <Text>Name: {userData.username}</Text>
          <Text>Email: {userData.email}</Text>
        </>
      )}
      <Button title="Logout" onPress={logoutUser} />
    </View>
  );
}
