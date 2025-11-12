// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// @ts-ignore  // remove once typings update
const { getReactNativePersistence } = await import("firebase/auth");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });


export const auth =
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  }) || getAuth(app);

export const db = getFirestore(app);