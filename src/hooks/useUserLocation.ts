// src/hooks/useUserLocation.ts
import { useEffect, useState } from "react";
import { getUserPosition, LocationPermissionError } from "@/services/locationService";
import type { Coordinates } from "@/utils/distance";

export type UserLocationState =
  | { status: "loading" }
  | { status: "success"; coords: Coordinates }
  | { status: "denied" } // l'utilisateur a refusé la permission
  | { status: "error" }; // GPS désactivé, délai dépassé...

/** Position de l'utilisateur, lue une fois au montage du composant. */
export function useUserLocation(): UserLocationState {
  const [state, setState] = useState<UserLocationState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false; // même protection que pour la météo : réponse ignorée si l'écran est quitté

    getUserPosition()
      .then((coords) => {
        if (!isCancelled) setState({ status: "success", coords });
      })
      .catch((error: unknown) => {
        if (isCancelled) return;
        setState(error instanceof LocationPermissionError ? { status: "denied" } : { status: "error" });
      });

    return () => {
      isCancelled = true;
    };
  }, []); // aucune dépendance : on lit la position une seule fois par affichage de l'écran

  return state;
}
