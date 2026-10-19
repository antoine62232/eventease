import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { AppEvent, EventInput } from "@/types/event";
import { generateId } from "@/utils/id";
import { readJson, writeJson } from "./storage";

// Toutes les opérations suivent le même schéma : lire la liste, produire une copie modifiée, réécrire.

/** Tous les événements stockés ([] au premier lancement). */
export function getEvents(): Promise<AppEvent[]> {
  return readJson<AppEvent[]>(STORAGE_KEYS.events, []);
}

function saveEvents(events: AppEvent[]): Promise<void> {
  return writeJson(STORAGE_KEYS.events, events);
}

/** Retrouve un événement ou lève une erreur explicite. */
function findEventOrThrow(events: AppEvent[], id: string): AppEvent {
  const event = events.find((e) => e.id === id);
  if (event === undefined) {
    throw new Error("Événement introuvable.");
  }
  return event;
}

/** Règle métier : seul le créateur peut modifier ou supprimer son événement. */
function assertIsOwner(event: AppEvent, userId: string): void {
  if (event.createdBy !== userId) {
    throw new Error("Seul le créateur de l'événement peut le modifier ou le supprimer.");
  }
}

export async function createEvent(input: EventInput, userId: string): Promise<AppEvent> {
  const events = await getEvents();
  const now = new Date().toISOString();

  const newEvent: AppEvent = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    createdBy: userId,
    participantIds: [], // le créateur ne participe pas d'office : il le décide comme les autres
    createdAt: now,
    updatedAt: now,
  };

  await saveEvents([...events, newEvent]);
  return newEvent;
}

export async function updateEvent(id: string, input: EventInput, userId: string): Promise<AppEvent> {
  const events = await getEvents();
  const existing = findEventOrThrow(events, id);
  assertIsOwner(existing, userId);

  // Spread : on garde id, createdBy, participantIds, createdAt, et on remplace le reste.
  const updated: AppEvent = {
    ...existing,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    updatedAt: new Date().toISOString(),
  };

  // map : même tableau, sauf l'élément modifié qui est remplacé par sa nouvelle version.
  await saveEvents(events.map((e) => (e.id === id ? updated : e)));
  return updated;
}

export async function deleteEvent(id: string, userId: string): Promise<void> {
  const events = await getEvents();
  const existing = findEventOrThrow(events, id);
  assertIsOwner(existing, userId);

  // filter : on garde tous les événements sauf celui-ci.
  await saveEvents(events.filter((e) => e.id !== id));
}

/** Ajoute l'utilisateur aux participants s'il n'y est pas, le retire sinon. */
export async function toggleParticipation(id: string, userId: string): Promise<AppEvent> {
  const events = await getEvents();
  const existing = findEventOrThrow(events, id);

  const isParticipating = existing.participantIds.includes(userId);
  const participantIds = isParticipating
    ? existing.participantIds.filter((participantId) => participantId !== userId)
    : [...existing.participantIds, userId];

  // Pas de contrôle de propriétaire : tout membre connecté peut participer.
  const updated: AppEvent = { ...existing, participantIds, updatedAt: new Date().toISOString() };

  await saveEvents(events.map((e) => (e.id === id ? updated : e)));
  return updated;
}