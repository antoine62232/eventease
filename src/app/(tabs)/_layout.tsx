import { Link, Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import { TabIcon } from "@/components/ui/TabIcon";

// Barre d'onglets en bas de l'écran, avec une icône native par onglet.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Événements",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={{ ios: "list.bullet", android: "event_list" }} color={color} size={size} />
          ),
          // Action principale de l'écran, toujours accessible même quand la liste est longue.
          headerRight: () => (
            <Link href="/event/form" style={styles.headerAction}>
              Ajouter
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendrier",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={{ ios: "calendar", android: "calendar_month" }} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={{ ios: "person", android: "person" }} color={color} size={size} />
          ),
        }}
      />
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