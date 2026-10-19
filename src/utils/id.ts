import * as Crypto from "expo-crypto";

// Identifiant unique universel (UUID v4).
// Probabilité de collision négligeable, pas besoin de compteur ni de serveur.
export function generateId(): string {
  return Crypto.randomUUID();
}