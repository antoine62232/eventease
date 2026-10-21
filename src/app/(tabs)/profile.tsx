import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PaperBackground } from "@/components/ui/PaperBackground";
import { IS_DEMO } from "@/constants/config";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { formatMonthYear } from "@/utils/dates";

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
      location: { label: "Béthune, FR", latitude: 50.5303, longitude: 2.6408 },
    });
    await addEvent({
      title: "Conférence climat",
      description: "Intervention d'un chercheur, suivie d'un échange avec le public.",
      date: inDays(10, 18),
      location: { label: "Lille, FR", latitude: 50.6365, longitude: 3.0635 },
    });
    await addEvent({ title: "Sortie randonnée", description: "", date: inDays(-5, 9), location: null });
    Alert.alert("Données de test", "3 événements créés.");
  };

  return (
    <PaperBackground>
      <View style={styles.container}>
        {/* La fiche du membre, comme une carte d'adhérent glissée dans le carnet. */}
        <Card tilt={-1} tape="pink" style={styles.memberCard}>
          {/* user ne peut pas être null ici : l'écran est protégé par le guard. */}
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user !== null && <Text style={styles.cardLabel}>membre depuis {formatMonthYear(user.createdAt)}</Text>}
        </Card>

        {/* __DEV__ : vrai dans Expo Go. IS_DEMO : vrai seulement dans l'APK de démo. Jamais dans une vraie version publiée. */}
        {(__DEV__ || IS_DEMO) && (
          <Button title="Créer des événements de test" variant="secondary" onPress={createTestEvents} />
        )}

        {/* Aucune navigation manuelle : signOut met user à null, le guard redirige. */}
        <Button title="Se déconnecter" variant="danger" onPress={signOut} />
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  memberCard: { alignItems: "center", paddingVertical: theme.spacing.xl, marginBottom: theme.spacing.lg },
  cardLabel: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.textMuted },
  name: { fontFamily: theme.fonts.hand, fontSize: theme.fontSize.handXl, lineHeight: 56, color: theme.colors.text, textAlign: "center" },
  email: { fontFamily: theme.fonts.body, fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center" },
});