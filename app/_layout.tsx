import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import "./global.css";

import UpdatePopup from '@/components/UpdatePopup';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/hooks/useAuth';
import { useCheckForUpdates } from '@/hooks/useCheckForUpdates';
import { useState } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
    const { updateMessage, isUpdateAvailable } = useCheckForUpdates();
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {Platform.OS !== 'web' && (
          <UpdatePopup
            visible={modalVisible}
            message={updateMessage}
            updateAvailable={isUpdateAvailable}
            onClose={() => setModalVisible(false)}
          />
        )}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
