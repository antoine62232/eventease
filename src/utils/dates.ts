// Formateurs créés une seule fois : les recréer à chaque appel coûterait inutilement.
const DAY_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Vrai si la chaîne représente une date valide. */
export function isValidIsoDate(isoDate: string): boolean {
  // new Date("n'importe quoi") ne lance pas d'erreur : il renvoie une "Invalid Date",
  // dont getTime() vaut NaN. C'est la seule façon fiable de détecter le problème.
  return !Number.isNaN(new Date(isoDate).getTime());
}

/** "samedi 25 octobre 2026 à 18:30", dans le fuseau horaire du téléphone. */
export function formatEventDate(isoDate: string): string {
  if (!isValidIsoDate(isoDate)) return "Date invalide";
  const date = new Date(isoDate);
  return `${DAY_FORMATTER.format(date)} à ${TIME_FORMATTER.format(date)}`;
}

/** Vrai si l'événement est déjà passé. now est injectable pour tester avec une date fixe. */
export function isPastEvent(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).getTime() < now.getTime();
}

/**
 * Renvoie une COPIE triée du plus proche au plus lointain.
 * Générique : fonctionne pour tout objet qui a un champ date en ISO.
 */
export function sortByDateAsc<T extends { date: string }>(items: T[]): T[] {
  // [...items] : sort() modifie le tableau sur lequel on l'appelle, on trie donc une copie.
  // Comparateur : négatif si a vient avant b, positif sinon.
  return [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Ordre d'affichage de la liste : à venir d'abord (plus proche en premier),
 * puis passés (plus récent en premier). items doit déjà être trié par date croissante.
 */
export function orderForDisplay<T extends { date: string }>(items: T[], now: Date = new Date()): T[] {
  const upcoming = items.filter((item) => !isPastEvent(item.date, now));
  // reverse() modifie le tableau, mais ici il s'applique au nouveau tableau créé par filter.
  const past = items.filter((item) => isPastEvent(item.date, now)).reverse();
  return [...upcoming, ...past];
}