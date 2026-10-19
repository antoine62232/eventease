// src/app/(auth)/login.tsx (version de test temporaire)
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { theme } from "@/constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <Button title="Se connecter" onPress={() => Alert.alert("Saisie", email)} />
      <Button title="Secondaire" variant="secondary" onPress={() => {}} />
      <Button title="Supprimer" variant="danger" onPress={() => {}} />
      <Button title="Chargement" loading onPress={() => {}} />
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