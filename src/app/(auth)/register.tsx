// src/app/(auth)/register.tsx
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <Link href="/login" style={styles.link}>
        Déjà un compte ? Se connecter
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: { fontSize: theme.fontSize.xl, fontWeight: "700", color: theme.colors.text },
  link: { fontSize: theme.fontSize.md, color: theme.colors.primary },
});