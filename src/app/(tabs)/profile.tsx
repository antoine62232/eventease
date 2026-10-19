// src/app/(tabs)/profile.tsx
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* user ne peut pas être null ici : l'écran est protégé par le guard. */}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      {/* Aucune navigation manuelle : signOut met user à null, le guard redirige. */}
      <Button title="Se déconnecter" variant="danger" onPress={signOut} />
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
  name: { fontSize: theme.fontSize.xl, fontWeight: "700", color: theme.colors.text, textAlign: "center" },
  email: { fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center" },
});