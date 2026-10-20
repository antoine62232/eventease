import { createContext, type ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import * as eventService from "@/services/eventService";
import type { AppEvent, EventInput } from "@/types/event";
import { sortByDateAsc } from "@/utils/dates";

const LOAD_ERROR = "Impossible de charger les événements.";

export type EventsContextValue = {
  events: AppEvent[]; // toujours triés du plus proche au plus lointain
  isLoading: boolean;
  error: string | null; // erreur de chargement, affichée par la liste
  reload: () => Promise<void>;
  addEvent: (input: EventInput) => Promise<AppEvent>;
  editEvent: (id: string, input: EventInput) => Promise<AppEvent>;
  removeEvent: (id: string) => Promise<void>;
  toggleParticipation: (id: string) => Promise<void>;
};

export const EventsContext = createContext<EventsContextValue | null>(null);

// Hors du composant : ne dépend d'aucun state, donc rien à déclarer dans le tableau du useEffect.
async function fetchSortedEvents(): Promise<AppEvent[]> {
  return sortByDateAsc(await eventService.getEvents());
}

type EventsProviderProps = {
  children: ReactNode;
};

export function EventsProvider({ children }: EventsProviderProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial, une seule fois au montage.
  useEffect(() => {
    fetchSortedEvents()
      .then(setEvents)
      .catch(() => setError(LOAD_ERROR))
      .finally(() => setIsLoading(false));
  }, []);

  /** Relit le stockage (bouton "Réessayer" après une erreur, tirer pour rafraîchir). */
  const reload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEvents(await fetchSortedEvents());
    } catch {
      setError(LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  /** Les actions exigent un utilisateur connecté : le service a besoin de son id. */
  const requireUserId = (): string => {
    if (user === null) {
      throw new Error("Vous devez être connecté.");
    }
    return user.id;
  };

  // Chaque action : 1. le service écrit dans le stockage, 2. on reporte le résultat dans le state.
  // Forme fonctionnelle (previous) => ... : on part toujours de la liste la plus récente.

  const addEvent = async (input: EventInput) => {
    const created = await eventService.createEvent(input, requireUserId());
    setEvents((previous) => sortByDateAsc([...previous, created]));
    return created;
  };

  const editEvent = async (id: string, input: EventInput) => {
    const updated = await eventService.updateEvent(id, input, requireUserId());
    // La date a pu changer : on retrie.
    setEvents((previous) => sortByDateAsc(previous.map((e) => (e.id === id ? updated : e))));
    return updated;
  };

  const removeEvent = async (id: string) => {
    await eventService.deleteEvent(id, requireUserId());
    setEvents((previous) => previous.filter((e) => e.id !== id));
  };

  const toggleParticipation = async (id: string) => {
    const updated = await eventService.toggleParticipation(id, requireUserId());
    // La date ne change pas : l'ordre reste le même, pas besoin de retrier.
    setEvents((previous) => previous.map((e) => (e.id === id ? updated : e)));
  };

  return (
    <EventsContext.Provider
      value={{ events, isLoading, error, reload, addEvent, editEvent, removeEvent, toggleParticipation }}
    >
      {children}
    </EventsContext.Provider>
  );
}