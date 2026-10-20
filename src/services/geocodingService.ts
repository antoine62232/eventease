// src/services/geocodingService.ts
import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from "@/constants/config";
import type { EventLocation } from "@/types/event";

// Forme de la réponse de l'API, réduite aux champs qu'on utilise.
type GeocodingResult = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
};

/**
 * Transforme un nom de ville ("Béthune", "Lille, FR") en lieu avec coordonnées.
 * API Geocoding d'OpenWeather : même clé que pour la météo.
 */
export async function geocodeCity(query: string): Promise<EventLocation> {
  if (OPENWEATHER_API_KEY === "") {
    throw new Error("Clé OpenWeather manquante : voir .env.example.");
  }

  // URLSearchParams encode les accents et les espaces ("Béthune" -> "B%C3%A9thune").
  const params = new URLSearchParams({ q: query.trim(), limit: "1", appid: OPENWEATHER_API_KEY });

  let response: Response;
  try {
    response = await fetch(`${OPENWEATHER_BASE_URL}/geo/1.0/direct?${params.toString()}`);
  } catch {
    // fetch ne rejette QUE sur une erreur réseau (pas de connexion, serveur injoignable).
    throw new Error("Pas de connexion : impossible de vérifier le lieu.");
  }

  // Une réponse 401 ou 500 ne fait pas rejeter fetch : il faut tester response.ok soi-même.
  if (response.status === 401) {
    throw new Error("Clé OpenWeather invalide ou pas encore activée.");
  }
  if (!response.ok) {
    throw new Error("Le service de lieux ne répond pas. Réessaie plus tard.");
  }

  const results = (await response.json()) as GeocodingResult[];
  const first = results[0];
  if (first === undefined) {
    throw new Error("Lieu introuvable. Essaie avec le nom d'une ville.");
  }

  return {
    // Nom français s'il existe ("Londres" plutôt que "London").
    label: `${first.local_names?.fr ?? first.name}, ${first.country}`,
    latitude: first.lat,
    longitude: first.lon,
  };
}
