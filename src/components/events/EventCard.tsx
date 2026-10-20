import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import type { AppEvent } from "@/types/event";
import { formatEventDate, isPastEvent } from "@/utils/dates";

type EventCardProps = {
  event: AppEvent;
  isParticipating: boolean; // calculé par l'écran, qui connaît l'utilisateur connecté
  onPress: () => void;
};

export function EventCard({ event, isParticipating, onPress }: EventCardProps) {
  const isPast = isPastEvent(event.date);
  const participantCount = event.participantIds.length;

  return (
    <Card onPress={onPress} style={isPast && styles.past}>
      <View style={styles.header}>
        {/* numberOfLines : le texte trop long est coupé avec "..." au lieu de déformer la carte */}
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {isParticipating && <Text style={styles.badge}>{isPast ? "J'ai participé" : "Je participe"}</Text>}
      </View>

      <Text style={styles.date}>{formatEventDate(event.date)}</Text>

      {event.description !== "" && (
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
      )}

      <Text style={styles.meta}>
        {participantCount} participant{participantCount > 1 ? "s" : ""}
        {isPast ? " · Passé" : ""}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  past: { opacity: 0.6 }, // événement passé : visible mais atténué
  header: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  title: { flex: 1, fontSize: theme.fontSize.lg, fontWeight: "700", color: theme.colors.text },
  badge: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.primaryText,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    overflow: "hidden", // nécessaire pour que les coins arrondis s'appliquent au fond d'un Text
  },
  date: { fontSize: theme.fontSize.sm, fontWeight: "600", color: theme.colors.primary },
  description: { fontSize: theme.fontSize.md, color: theme.colors.text },
  meta: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
});