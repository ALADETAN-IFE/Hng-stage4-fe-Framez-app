import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@example.com');

  const onSignIn = async () => {
    await signIn({ name, email });
    // replace history to main tabs
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 relative w-full min-h-[100vh] pb-4">
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to Framez</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
      <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Email" keyboardType="email-address" />
      <Button title="Sign in (demo)" onPress={onSignIn} />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 16 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 12 },
});
