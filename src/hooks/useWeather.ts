import { useEffect, useState } from "react";
import { getForecastAt } from "@/services/weatherService";
import type { Forecast } from "@/types/weather";

// Un seul state qui décrit toute la situation : impossible d'être à la fois "loading" et "error".
export type WeatherState =
  | { status: "loading" }
  | { status: "success"; forecast: Forecast }
  | { status: "unavailable" } // date hors des 5 jours de prévision
  | { status: "error"; message: string };

/** Charge la prévision d'un lieu à une date (requête : se déclenche toute seule). */
export function useWeather(latitude: number, longitude: number, isoDate: string): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  // Dépendances primitives (nombres, chaîne) : un objet location recréé à chaque rendu
  // aurait une nouvelle référence et relancerait l'appel en boucle.
  useEffect(() => {
    let isCancelled = false; // passe à true si l'écran est quitté ou si le lieu change avant la réponse
    setState({ status: "loading" });

    getForecastAt(latitude, longitude, isoDate)
      .then((forecast) => {
        if (isCancelled) return; // réponse périmée : on l'ignore
        setState(forecast === null ? { status: "unavailable" } : { status: "success", forecast });
      })
      .catch((error: unknown) => {
        if (isCancelled) return;
        setState({ status: "error", message: error instanceof Error ? error.message : "Météo indisponible." });
      });

    // Nettoyage : appelé avant le prochain effet et au démontage du composant.
    return () => {
      isCancelled = true;
    };
  }, [latitude, longitude, isoDate]);

  return state;
}
