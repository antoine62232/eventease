import { router, Stack, useLocalSearchParams } from "expo-router";
import { EventForm } from "@/components/events/EventForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import type { EventInput } from "@/types/event";
import { defaultEventDate } from "@/utils/dates";

export default function EventFormScreen() {
  // id absent = création, id présent = modification.
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const { events, addEvent, editEvent } = useEvents();

  const isEditMode = id !== undefined;
  const event = isEditMode ? events.find((e) => e.id === id) : undefined;
  const screenTitle = isEditMode ? "Modifier l'événement" : "Nouvel événement";

  const handleSubmit = async (input: EventInput) => {
    if (id !== undefined) {
      await editEvent(id, input);
    } else {
      await addEvent(input);
    }
    // Retour à l'écran précédent : la liste (ou le détail) affiche déjà la nouvelle version via le Context.
    router.back();
  };

  // Cas limites du mode modification, vérifiés avant d'afficher le formulaire.
  if (id !== undefined) {
    if (event === undefined) {
      return (
        <>
          <Stack.Screen options={{ title: screenTitle }} />
          <EmptyState
            title="Événement introuvable"
            message="Il a peut-être été supprimé."
            actionLabel="Retour"
            onAction={() => router.back()}
          />
        </>
      );
    }
    // Même règle que dans le service : l'interface la vérifie aussi, pour un message clair.
    if (event.createdBy !== user?.id) {
      return (
        <>
          <Stack.Screen options={{ title: screenTitle }} />
          <EmptyState
            title="Modification impossible"
            message="Seul le créateur de l'événement peut le modifier."
            actionLabel="Retour"
            onAction={() => router.back()}
          />
        </>
      );
    }
  }

  const initialValues: EventInput =
    event !== undefined
      ? { title: event.title, description: event.description, date: event.date }
      : { title: "", description: "", date: defaultEventDate() };

  return (
    <>
      {/* Titre de l'en-tête défini par l'écran lui-même, selon le mode. */}
      <Stack.Screen options={{ title: screenTitle }} />
      <EventForm
        initialValues={initialValues}
        submitLabel={isEditMode ? "Enregistrer" : "Créer l'événement"}
        allowPastDate={isEditMode}
        onSubmit={handleSubmit}
      />
    </>
  );
}