import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { EventsProvider } from "@/context/EventsContext";

export default function RootLayout() {
  // L'ordre compte : EventsProvider appelle useAuth(), il doit donc être DANS AuthProvider.
  return (
    <AuthProvider>
      <EventsProvider>
        <RootNavigator />
      </EventsProvider>
    </AuthProvider>
  );
}

// Composant séparé obligatoire : useAuth() doit être appelé SOUS le Provider.
// Appelé directement dans RootLayout, il serait au-dessus du Provider et lèverait l'erreur.
function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Tant que la session n'est pas lue, on ne sait pas quels écrans autoriser.
  // Sans ce test, l'écran de connexion clignoterait au lancement pour un utilisateur déjà connecté.
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isLoggedIn = user !== null;

  return (
    <Stack>
      {/* Écrans réservés aux utilisateurs connectés */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: "Détail" }} />
        <Stack.Screen name="event/form" options={{ title: "Événement" }} />
      </Stack.Protected>

      {/* Écrans réservés aux visiteurs non connectés */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});