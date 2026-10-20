// src/hooks/useGeocoding.ts
import { useState } from "react";
import { geocodeCity } from "@/services/geocodingService";
import type { EventLocation } from "@/types/event";

/** Recherche d'un lieu à la demande (mutation) : expose la fonction et l'état de chargement. */
export function useGeocoding() {
  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocode = async (query: string): Promise<EventLocation> => {
    setIsGeocoding(true);
    try {
      return await geocodeCity(query);
    } finally {
      setIsGeocoding(false);
    }
  };

  return { geocode, isGeocoding };
}
