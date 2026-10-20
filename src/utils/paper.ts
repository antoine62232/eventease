import type { TapeColor } from "@/types/ui";

/**
 * Décor d'une fiche selon sa position dans la liste : inclinaison alternée et ruban alterné.
 * Fonction pure : la même position donne toujours le même décor, pas de hasard qui changerait à chaque rendu.
 */
export function paperDecor(index: number): { tilt: number; tape: TapeColor } {
  return index % 2 === 0 ? { tilt: -1, tape: "pink" } : { tilt: 1, tape: "mint" };
}
