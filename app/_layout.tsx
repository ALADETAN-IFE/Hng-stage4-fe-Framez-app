import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import "react-native-reanimated";
import "./global.css";

import UpdatePopup from "@/components/UpdatePopup";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthWrapper from "@/hooks/useAuth";
import { useCheckForUpdates } from "@/hooks/useCheckForUpdates";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { updateMessage, isUpdateAvailable } = useCheckForUpdates();
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <AuthWrapper>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {Platform.OS !== "web" && (
          <UpdatePopup
            visible={modalVisible}
            message={updateMessage}
            updateAvailable={isUpdateAvailable}
            onClose={() => setModalVisible(false)}
          />
        )}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthWrapper>
  );
}
