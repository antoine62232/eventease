import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StorageKey } from "@/constants/storageKeys";

/**
 * Lit une valeur JSON. Renvoie fallback si la clé n'existe pas encore
 * ou si la donnée stockée est illisible.
 */
export async function readJson<T>(key: StorageKey, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);

  // Premier lancement : rien n'a encore été écrit sous cette clé.
  if (raw === null) {
    return fallback;
  }

  try {
    // JSON.parse renvoie any : le "as T" est une promesse faite à TypeScript,
    // pas une vérification à l'exécution.
    return JSON.parse(raw) as T;
  } catch {
    // Donnée corrompue : on évite de faire planter l'app au démarrage.
    console.warn(`Donnée illisible sous la clé ${key}, valeur par défaut utilisée.`);
    return fallback;
  }
}

/** Écrit une valeur sérialisée en JSON. Remplace entièrement l'ancienne. */
export async function writeJson<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/** Supprime une clé (utilisé à la déconnexion pour effacer la session). */
export async function removeItem(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}