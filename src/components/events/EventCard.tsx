import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Highlight } from "@/components/ui/Highlight";
import { theme } from "@/constants/theme";
import type { AppEvent } from "@/types/event";
import type { TapeColor } from "@/types/ui";
import { formatEventDate, isPastEvent } from "@/utils/dates";
import { formatParticipantCount } from "@/utils/participation";

type EventCardProps = {
  event: AppEvent;
  isParticipating: boolean; // calculé par l'écran, qui connaît l'utilisateur connecté
  onPress: () => void;
  tilt?: number; // décor de la fiche, fourni par la liste (voir utils/paper.ts)
  tape?: TapeColor;
};

export function EventCard({ event, isParticipating, onPress, tilt = 0, tape }: EventCardProps) {
  const isPast = isPastEvent(event.date);

  return (
    // Événement passé : fiche grise, droite, ruban gris foncé, comme une fiche archivée.
    <Card onPress={onPress} tilt={isPast ? 0 : tilt} tape={isPast ? "gray" : tape} style={isPast && styles.past}>
      <Text style={[styles.date, isPast && styles.mutedText]}>{formatEventDate(event.date)}</Text>

      {/* numberOfLines : le texte trop long est coupé avec "..." au lieu de déformer la fiche */}
      {/* Titre barré au stylo : l'événement est "fait", comme une ligne cochée dans une liste. */}
      <Text style={[styles.title, isPast && styles.pastTitle]} numberOfLines={1}>
        {event.title}
      </Text>

      {event.description !== "" && (
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.meta}>
          {event.location !== null ? `${event.location.label} · ` : ""}
          {formatParticipantCount(event.participantIds.length)}
        </Text>
        {isParticipating && <Highlight>{isPast ? "j'y étais" : "j'y vais !"}</Highlight>}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  past: { backgroundColor: theme.colors.pastCard, elevation: 0, shadowOpacity: 0 },
  date: { fontFamily: theme.fonts.hand, fontSize: theme.fontSize.hand, color: theme.colors.primary },
  title: { fontFamily: theme.fonts.bodyBold, fontSize: theme.fontSize.lg, color: theme.colors.text },
  mutedText: { color: theme.colors.textMuted },
  pastTitle: {
    color: theme.colors.textMuted,
    textDecorationLine: "line-through",
    textDecorationColor: theme.colors.primary,
  },
  description: { fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 22, color: theme.colors.textMuted },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  meta: { flexShrink: 1, fontFamily: theme.fonts.body, fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
});
