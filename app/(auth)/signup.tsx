import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import { signUpUser } from "@/services/authService";
import { createProfile } from "@/services/profileService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const signUpData = await signUpUser(email, password, username);
      const user = signUpData.user ?? signUpData.session?.user;

      if (user) {
        // Try to create/update profile, but don't fail if it errors
        // The database trigger should create it automatically
        try {
          await createProfile({
            userId: user.id,
            username: username.trim(),
            email: email.trim(),
          });
        } catch (profileError) {
          // Log but don't fail signup - trigger should handle it
          console.warn("Profile creation failed, but trigger should handle it:", profileError);
        }
      }

      setInfo(
        "Check your inbox to verify your email. You'll be redirected once the account is confirmed."
      );
    } catch (err: any) {
      const message = err?.message ?? "Unable to sign up. Check details and try again.";
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
      <Text className="text-3xl font-bold text-white">Create your Framez account</Text>
      <Text className="mt-2 text-base text-framez-mist">
        Sign up to start sharing your gallery-worthy moments.
      </Text>

      <View className="mt-8 space-y-4 gap-3 w-full">
        <TextInput
          className="rounded-2xl border border-white/10 bg-framez-slate/80 px-5 py-4 text-base text-white"
          placeholder="Username"
          placeholderTextColor="#94A3B8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          className="rounded-2xl border border-white/10 bg-framez-slate/80 px-5 py-4 text-base text-white"
          placeholder="Email address"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
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
        {info ? <Text className="text-sm text-framez-sky">{info}</Text> : null}
        <TouchableOpacity
          className="mt-2 items-center rounded-2xl bg-framez-accent py-4"
          disabled={loading}
          onPress={handleSignUp}
        >
          <Text className="text-base font-semibold text-framez-nightfall">
            {loading ? "Creating account..." : "Sign up"}
          </Text>
        </TouchableOpacity>
        </View>

        <Text className="text-center text-sm text-framez-mist">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-framez-sky">
            Sign in
          </Link>
        </Text>
      </View>
    </View>
    </SafeAreaView>
  );
}
