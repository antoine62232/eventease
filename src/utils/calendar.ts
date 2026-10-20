import type { CalendarProps } from "react-native-calendars";
import type { AppEvent } from "@/types/event";
import { toLocalDayKey } from "@/utils/dates";

// Type attendu par la prop markedDates du calendrier : { "2026-10-22": { marked: true, ... } }.
type MarkedDates = NonNullable<CalendarProps["markedDates"]>;

/**
 * Construit les marquages du calendrier : marked pour chaque jour qui a au moins un événement,
 * selected pour le jour choisi. L'apparence est décidée par CalendarDay, pas ici.
 */
export function buildMarkedDates(events: AppEvent[], selectedDay: string): MarkedDates {
  const marked: MarkedDates = {};

  // Un seul passage sur la liste : plusieurs événements le même jour donnent un seul point.
  for (const event of events) {
    marked[toLocalDayKey(event.date)] = { marked: true };
  }

  // Le jour sélectionné garde son marquage s'il en a un (spread), et reçoit selected.
  marked[selectedDay] = { ...marked[selectedDay], selected: true };

  return marked;
}

/** Événements d'un jour local donné. events doit déjà être trié : l'ordre est conservé. */
export function eventsOnDay(events: AppEvent[], dayKey: string): AppEvent[] {
  return events.filter((event) => toLocalDayKey(event.date) === dayKey);
}
