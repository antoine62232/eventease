import { Stack } from "expo-router";

// Stack racine : tous les écrans de l'app passent par lui.
// Les routes existent dès que le fichier existe. Déclarer un Stack.Screen
// sert uniquement à configurer ses options (titre, en-tête...).
export default function RootLayout() {
  return (
    <Stack>
      {/* Les groupes ont leur propre navigator : on masque l'en-tête du Stack racine
          pour ne pas avoir deux en-têtes empilés. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ title: "Détail" }} />
      <Stack.Screen name="event/form" options={{ title: "Événement" }} />
    </Stack>
  );
}