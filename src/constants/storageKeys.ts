// Clés AsyncStorage centralisées : jamais de chaîne écrite en dur ailleurs.
// Le préfixe @eventease/ évite toute collision avec une autre donnée stockée.
export const STORAGE_KEYS = {
  users: "@eventease/users",
  session: "@eventease/session",
  events: "@eventease/events",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];