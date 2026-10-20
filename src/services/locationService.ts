// src/services/locationService.ts
import * as Location from "expo-location";
import type { Coordinates } from "@/utils/distance";

/** Erreur dédiée : l'écran affiche un message différent quand l'utilisateur a refusé. */
export class LocationPermissionError extends Error {}

/** Position actuelle de l'utilisateur. Demande la permission si elle n'a pas encore été donnée. */
export async function getUserPosition(): Promise<Coordinates> {
  // Ouvre la fenêtre système au premier appel ; ensuite, renvoie directement la réponse mémorisée.
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new LocationPermissionError("Localisation refusée.");
  }

  // Dernière position connue de moins de 5 minutes : instantané et sans GPS.
  const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 });
  // Sinon, nouvelle mesure. Précision "Balanced" : à la centaine de mètres, rapide et économe en batterie.
  const position = lastKnown ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));

  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}
