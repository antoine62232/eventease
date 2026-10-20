import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { orderForDisplay } from "@/utils/dates";

export default function EventsScreen() {
  const { user } = useAuth();
  const { events, isLoading, error, reload } = useEvents();

  const goToForm = () => router.push("/event/form");

  // État 1 : premier chargement, rien à afficher encore.
  if (isLoading && events.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // État 2 : le stockage n'a pas pu être lu.
  if (error !== null) {
    return <EmptyState title="Oups" message={error} actionLabel="Réessayer" onAction={reload} />;
  }

  // État 3 : la liste, vide ou non.
  return (
    <FlatList
      data={orderForDisplay(events)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          isParticipating={user !== null && item.participantIds.includes(user.id)}
          onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
        />
      )}
      // Liste vide : on étire le conteneur pour centrer le message.
      contentContainerStyle={events.length === 0 ? styles.emptyContent : styles.content}
      ListEmptyComponent={
        <EmptyState
          title="Aucun événement"
          message="Crée le premier événement de l'association."
          actionLabel="Créer un événement"
          onAction={goToForm}
        />
      }
      // Tirer vers le bas pour relire le stockage.
      refreshing={isLoading}
      onRefresh={reload}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, gap: theme.spacing.md },
  emptyContent: { flexGrow: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background },
});