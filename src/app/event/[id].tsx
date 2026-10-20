import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { DistanceInfo } from "@/components/events/DistanceInfo";
import { ParticipationToggle } from "@/components/events/ParticipationToggle";
import { WeatherCard } from "@/components/events/WeatherCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Highlight } from "@/components/ui/Highlight";
import { PaperBackground } from "@/components/ui/PaperBackground";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { formatEventDate, isPastEvent } from "@/utils/dates";
import { getErrorMessage } from "@/utils/errors";
import { formatParticipantCount, isUserParticipating } from "@/utils/participation";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { events, removeEvent, toggleParticipation } = useEvents();
  const [isDeleting, setIsDeleting] = useState(false);

  // L'événement vient du Context : s'il est modifié ailleurs, cet écran se met à jour seul.
  const event = events.find((e) => e.id === id);

  if (event === undefined) {
    // Pendant une suppression, l'événement disparaît du Context avant que router.back() ait quitté l'écran :
    // on n'affiche rien plutôt qu'un "introuvable" qui clignote.
    if (isDeleting) return null;
    return (
      <EmptyState
        title="Événement introuvable"
        message="Il a peut-être été supprimé."
        actionLabel="Retour à la liste"
        onAction={() => router.back()}
      />
    );
  }

  const isOwner = user !== null && event.createdBy === user.id;
  const isPast = isPastEvent(event.date);
  const isParticipating = isUserParticipating(event, user?.id);

  const handleToggleParticipation = async () => {
    try {
      await toggleParticipation(event.id);
    } catch (error) {
      Alert.alert("Participation impossible", getErrorMessage(error));
    }
  };

  const deleteEvent = async () => {
    setIsDeleting(true);
    try {
      await removeEvent(event.id);
      router.back();
    } catch (error) {
      setIsDeleting(false);
      Alert.alert("Suppression impossible", getErrorMessage(error));
    }
  };

  const confirmDelete = () => {
    // Dialogue natif : rien n'est supprimé tant que l'utilisateur n'a pas confirmé.
    Alert.alert(
      "Supprimer l'événement ?",
      `« ${event.title} » sera définitivement supprimé.`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: deleteEvent },
      ],
      { cancelable: true }, // Android : un appui hors du dialogue vaut "Annuler"
    );
  };

  return (
    <PaperBackground>
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <Text style={[styles.title, isPast && styles.pastTitle]}>{event.title}</Text>
        <Highlight style={styles.date}>{formatEventDate(event.date)}</Highlight>

        {/* Infos à gauche, post-it météo à droite. */}
        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            {event.location !== null && (
              <>
                <Text style={styles.location}>{event.location.label}</Text>
                <DistanceInfo location={event.location} />
              </>
            )}
            {isPast && <Text style={styles.meta}>Cet événement est passé.</Text>}
            <Text style={styles.meta}>
              {formatParticipantCount(event.participantIds.length)}
              {isOwner ? " · c'est toi qui organises" : ""}
            </Text>
          </View>

          {/* Météo : seulement s'il y a un lieu, et pas pour un événement passé (l'API ne donne que des prévisions). */}
          {event.location !== null && !isPast && <WeatherCard location={event.location} date={event.date} />}
        </View>

        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Le programme</Text>
          <Text style={styles.description}>
            {event.description !== "" ? event.description : "Aucune description."}
          </Text>
        </Card>

        {/* Participation : ouverte à tout membre connecté, créateur compris. */}
        <View style={styles.actions}>
          <ParticipationToggle
            isParticipating={isParticipating}
            isPast={isPast}
            onToggle={handleToggleParticipation}
          />
        </View>

        {/* Actions réservées au créateur. Le service refuse de toute façon les autres. */}
        {isOwner && (
          <View style={styles.actions}>
            <Button
              title="Modifier"
              variant="secondary"
              onPress={() => router.push({ pathname: "/event/form", params: { id: event.id } })}
            />
            <Button title="Supprimer" variant="danger" onPress={confirmDelete} loading={isDeleting} />
          </View>
        )}
      </ScrollView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" }, // laisse voir le quadrillage
  container: { padding: theme.spacing.lg, gap: theme.spacing.sm },
  title: { fontFamily: theme.fonts.hand, fontSize: theme.fontSize.handXl, lineHeight: 54, color: theme.colors.text },
  pastTitle: { color: theme.colors.textMuted, textDecorationLine: "line-through" },
  date: { fontFamily: theme.fonts.bodySemiBold, fontSize: 17 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md, marginTop: theme.spacing.md },
  infoColumn: { flex: 1, gap: theme.spacing.sm },
  meta: { fontFamily: theme.fonts.body, fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  location: { fontFamily: theme.fonts.bodySemiBold, fontSize: theme.fontSize.md, color: theme.colors.text },
  descriptionCard: { marginTop: theme.spacing.lg },
  sectionTitle: { fontFamily: theme.fonts.hand, fontSize: theme.fontSize.hand, color: theme.colors.text },
  description: { fontFamily: theme.fonts.body, fontSize: theme.fontSize.md, color: theme.colors.text, lineHeight: 23 },
  actions: { marginTop: theme.spacing.lg, gap: theme.spacing.sm },
});