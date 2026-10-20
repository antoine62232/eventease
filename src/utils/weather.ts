// L'API gratuite donne une prévision toutes les 3 heures, sur 5 jours.
export const FORECAST_STEP_MS = 3 * 60 * 60 * 1000;

/**
 * Parmi des créneaux (timestamps en ms), renvoie l'index du plus proche de target.
 * -1 si target est hors de la période couverte (plus d'un créneau avant le premier ou après le dernier).
 * Parcours linéaire : 40 créneaux au maximum, inutile de faire plus compliqué.
 */
export function findClosestSlotIndex(slots: number[], target: number): number {
  if (slots.length === 0) return -1;
  const first = slots[0];
  const last = slots[slots.length - 1];
  if (target < first - FORECAST_STEP_MS || target > last + FORECAST_STEP_MS) return -1;

  let bestIndex = 0;
  for (let i = 1; i < slots.length; i++) {
    if (Math.abs(slots[i] - target) < Math.abs(slots[bestIndex] - target)) {
      bestIndex = i;
    }
  }
  return bestIndex;
}
