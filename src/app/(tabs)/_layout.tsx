import { Link, Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { TabIcon } from "@/components/ui/TabIcon";
import { theme } from "@/constants/theme";

// Barre d'onglets en bas de l'écran, avec une icône native par onglet.
export default function TabsLayout() {
  // Hauteur de la barre de navigation du téléphone (boutons ou barre de geste), différente selon l'appareil.
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        // Onglet actif surligné au marqueur, comme dans un carnet.
        tabBarActiveBackgroundColor: theme.colors.highlighter,
        tabBarItemStyle: { borderRadius: theme.radius.md, marginHorizontal: theme.spacing.sm, marginVertical: 6, overflow: "hidden" },
        // Caveat a de grandes boucles : sans lineHeight, le bas des lettres est coupé.
        tabBarLabelStyle: { fontFamily: theme.fonts.hand, fontSize: 18, lineHeight: 22 },
        // Hauteur fixée nous-mêmes : on rajoute la zone des boutons du téléphone pour ne pas passer dessous.
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.primary,
          height: 72 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        headerTitle: ({ children }) => <HeaderTitle size={theme.fontSize.handLg}>{children}</HeaderTitle>,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
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
    fontFamily: theme.fonts.hand,
    fontSize: theme.fontSize.hand,
    color: theme.colors.primary,
  },
});