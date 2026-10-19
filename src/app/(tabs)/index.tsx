// src/app/(tabs)/index.tsx
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Événements</Text>

      {/* Route dynamique : on passe le paramètre id séparément du chemin */}
      <Link href={{ pathname: "/event/[id]", params: { id: "42" } }} style={styles.link}>
        Voir l'événement 42
      </Link>

      {/* Même écran de formulaire, deux modes selon la présence d'un id */}
      <Link href="/event/form" style={styles.link}>
        Créer un événement
      </Link>
      <Link href={{ pathname: "/event/form", params: { id: "42" } }} style={styles.link}>
        Modifier l'événement 42
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