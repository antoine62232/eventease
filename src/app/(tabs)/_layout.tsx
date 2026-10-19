// src/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { theme } from "@/constants/theme";

// Barre d'onglets en bas de l'écran
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary }}>
      <Tabs.Screen name="index" options={{ title: "Événements" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}