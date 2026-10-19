// src/app/(auth)/login.tsx (version de test temporaire)
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { getSession, login, logout, register } from "@/services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const user = await register({ name: "Test", email, password });
      Alert.alert("Inscrit", JSON.stringify(user));
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  const handleLogin = async () => {
    try {
      await logout();
      const user = await login(email, password);
      Alert.alert("Connecté", JSON.stringify(user));
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  const handleSession = async () => {
    Alert.alert("Session", JSON.stringify(await getSession()));
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="nom@exemple.fr"
      />
      <Input
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={password.length > 0 && password.length < 6 ? "6 caractères minimum" : undefined}
      />
      <Button title="S'inscrire (test)" onPress={handleRegister} />
      <Button title="Se connecter (test)" variant="secondary" onPress={handleLogin} />
      <Button title="Session ?" variant="secondary" onPress={handleSession} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});