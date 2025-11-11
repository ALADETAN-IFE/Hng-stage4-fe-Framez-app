import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "./global.css"

import { useColorScheme } from '@/hooks/use-color-scheme';
import UpdatePopup from '@/components/UpdatePopup';
import { useCheckForUpdates } from '@/hooks/useCheckForUpdates';
import { useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
    const { updateMessage, isUpdateAvailable } = useCheckForUpdates();
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UpdatePopup
          visible={modalVisible}
          message={updateMessage}
          updateAvailable={isUpdateAvailable}
          onClose={() => setModalVisible(false)}
        />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
