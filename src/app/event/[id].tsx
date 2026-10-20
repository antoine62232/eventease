import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { formatEventDate, isPastEvent } from "@/utils/dates";
import { ParticipationToggle } from "@/components/events/ParticipationToggle";
import { WeatherCard } from "@/components/events/WeatherCard";

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
  const participantCount = event.participantIds.length;
  // L'utilisateur est-il dans la liste des participants de cet événement ?
  const isParticipating = user !== null && event.participantIds.includes(user.id);

  const handleToggleParticipation = async () => {
    try {
      await toggleParticipation(event.id);
    } catch (error) {
      Alert.alert("Participation impossible", error instanceof Error ? error.message : "Une erreur est survenue.");
    }
  };

  const deleteEvent = async () => {
    setIsDeleting(true);
    try {
      await removeEvent(event.id);
      router.back();
    } catch (error) {
      setIsDeleting(false);
      Alert.alert("Suppression impossible", error instanceof Error ? error.message : "Une erreur est survenue.");
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{formatEventDate(event.date)}</Text>

      {event.location !== null && <Text style={styles.location}>{event.location.label}</Text>}

      {isPast && <Text style={styles.meta}>Cet événement est passé.</Text>}

      <Text style={styles.meta}>
        {participantCount} participant{participantCount > 1 ? "s" : ""}
        {isOwner ? " · Tu es l'organisateur" : ""}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {event.description !== "" ? event.description : "Aucune description."}
        </Text>
      </View>

      {/* Météo : seulement s'il y a un lieu, et pas pour un événement passé (l'API ne donne que des prévisions). */}
      {event.location !== null && !isPast && <WeatherCard location={event.location} date={event.date} />}

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
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: theme.spacing.lg, gap: theme.spacing.sm },
  title: { fontSize: theme.fontSize.xl, fontWeight: "700", color: theme.colors.text },
  date: { fontSize: theme.fontSize.md, fontWeight: "600", color: theme.colors.primary },
  meta: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  location: { fontSize: theme.fontSize.md, color: theme.colors.text },
  section: { marginTop: theme.spacing.md, gap: theme.spacing.xs },
  sectionTitle: { fontSize: theme.fontSize.sm, fontWeight: "700", color: theme.colors.text },
  description: { fontSize: theme.fontSize.md, color: theme.colors.text, lineHeight: 22 },
  actions: { marginTop: theme.spacing.lg, gap: theme.spacing.sm },
});