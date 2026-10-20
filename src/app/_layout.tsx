import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { useAuth } from "@/hooks/useAuth";

// Au niveau du module, sans await (recommandation de la doc) : le splash natif reste affiché
// jusqu'à notre appel à hide(), au lieu de disparaître dès le premier rendu.
SplashScreen.preventAutoHideAsync();

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

  // Session lue : on cache le splash. L'utilisateur passe directement du splash au bon écran.
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  // Tant que la session n'est pas lue, on ne sait pas quels écrans autoriser.
  // Le splash est encore affiché par-dessus : inutile de rendre quoi que ce soit.
  if (isLoading) {
    return null;
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