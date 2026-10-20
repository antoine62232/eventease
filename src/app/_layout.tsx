import { Caveat_500Medium, Caveat_700Bold } from "@expo-google-fonts/caveat";
import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
  InterTight_700Bold,
} from "@expo-google-fonts/inter-tight";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { theme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { useAuth } from "@/hooks/useAuth";

// Au niveau du module, sans await (recommandation de la doc) : le splash natif reste affiché
// jusqu'à notre appel à hide(), au lieu de disparaître dès le premier rendu.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Chargement des polices pendant le splash. Chaque clé devient un nom de famille utilisable dans fontFamily.
  const [fontsLoaded, fontError] = useFonts({
    Caveat_500Medium,
    Caveat_700Bold,
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
    InterTight_700Bold,
  });

  // Splash encore affiché : on attend les polices. En cas d'erreur, l'app démarre avec la police système.
  if (!fontsLoaded && fontError === null) {
    return null;
  }

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
    <Stack
      screenOptions={{
        // En-tête façon carnet : fond papier, titre manuscrit à l'encre, pas d'ombre.
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontFamily: theme.fonts.hand, fontSize: theme.fontSize.handLg - 6 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
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