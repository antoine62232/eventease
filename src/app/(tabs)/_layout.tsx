// src/app/(tabs)/_layout.tsx
import { Link, Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

// Barre d'onglets en bas de l'écran. Les icônes viendront au jour 3.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Événements",
          // Action principale de l'écran, toujours accessible même quand la liste est longue.
          headerRight: () => (
            <Link href="/event/form" style={styles.headerAction}>
              Ajouter
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerAction: {
    marginRight: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});