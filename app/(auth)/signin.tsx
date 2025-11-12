import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signInUser } from "@/services/authService";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInUser(email, password);
    } catch (err: any) {
      const message = err?.message ?? "Unable to sign in. Check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-framez-midnight justify-center items-center">

    <View className="flex-1 px-6 pt-16 min-h-screen md:w-9/10 lg:w-[700px] justify-center items-center">
      <View className="items-center w-full">
        <Image
          source={require("../../assets/logo-removebg-preview2.png")}
          className="h-24 w-24"
          resizeMode="contain"
        />
      </View>
      <Text className="mt-6 text-3xl font-bold text-white">Welcome back to Framez</Text>
      <Text className="mt-2 text-base text-framez-mist">
        Sign in to continue sharing your favorite moments.
      </Text>
      <View className="mt-8 space-y-4 gap-3 w-full">
        <TextInput
          className="rounded-2xl border border-white/10 bg-framez-slate/80 px-5 py-4 text-base text-white"
          placeholder="Email address"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="rounded-2xl border border-white/10 bg-framez-slate/80 px-5 py-4 text-base text-white"
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View className="gap-2">
        {error ? <Text className="text-sm text-red-400">{error}</Text> : null}
        <TouchableOpacity
          className="mt-2 items-center rounded-2xl bg-framez-accent py-4"
          disabled={loading}
          onPress={handleSignIn}
        >
          <Text className="text-base font-semibold text-framez-nightfall">
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>
        </View>
        <Text className="text-center text-sm text-framez-mist">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-semibold text-framez-sky">
            Create one
          </Link>
        </Text>
      </View>
    </View>
    </SafeAreaView>
  );
}
