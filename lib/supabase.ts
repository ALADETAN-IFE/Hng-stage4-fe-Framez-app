import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("Missing Supabase environment variables")
  throw new Error("Missing Supabase enviuse zustand and expo-image-pickerronment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        ...(Platform.OS !== 'web' ? {storage: AsyncStorage}: {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock
    }
});


// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or 
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh()
        }
    })
}