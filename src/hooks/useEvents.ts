import { useContext } from "react";
import { EventsContext, type EventsContextValue } from "@/context/EventsContext";

/** Accès à la liste des événements et aux actions qui la modifient. */
export function useEvents(): EventsContextValue {
  const context = useContext(EventsContext);
  if (context === null) {
    throw new Error("useEvents doit être utilisé à l'intérieur d'un EventsProvider.");
  }
  return context;
}