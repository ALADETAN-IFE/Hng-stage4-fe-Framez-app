import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signUpUser } from "@/services/authService";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await signUpUser(email, password, name);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign Up</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}
