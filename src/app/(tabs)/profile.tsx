// src/app/(tabs)/profile.tsx
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";

/** Date ISO dans `days` jours (négatif = dans le passé), à l'heure indiquée. */
function inDays(days: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { addEvent } = useEvents();

  const createTestEvents = async () => {
    await addEvent({
      title: "Atelier photo",
      description: "Initiation à la photo de rue. Apporter son appareil ou son téléphone.",
      date: inDays(3, 14),
    });
    await addEvent({
      title: "Conférence climat",
      description: "Intervention d'un chercheur, suivie d'un échange avec le public.",
      date: inDays(10, 18),
    });
    await addEvent({ title: "Sortie randonnée", description: "", date: inDays(-5, 9) });
    Alert.alert("Données de test", "3 événements créés.");
  };

  return (
    <View style={styles.container}>
      {/* user ne peut pas être null ici : l'écran est protégé par le guard. */}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {/* __DEV__ vaut true en développement et false dans l'app compilée : ce bouton n'existera jamais en production. */}
      {__DEV__ && (
        <Button title="Créer des événements de test" variant="secondary" onPress={createTestEvents} />
      )}

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
  email: { fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center", marginBottom: theme.spacing.md },
});