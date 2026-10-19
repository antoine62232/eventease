// src/app/(tabs)/profile.tsx
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      {/* Lien temporaire : la redirection automatique arrive à l'étape 1.9 */}
      <Link href="/login" style={styles.link}>
        Aller à la connexion
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