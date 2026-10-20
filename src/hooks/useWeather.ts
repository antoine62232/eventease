import { useEffect, useState } from "react";
import { getForecastAt } from "@/services/weatherService";
import type { Forecast } from "@/types/weather";
import { getErrorMessage } from "@/utils/errors";

// Un seul state qui décrit toute la situation : impossible d'être à la fois "loading" et "error".
export type WeatherState =
  | { status: "loading" }
  | { status: "success"; forecast: Forecast }
  | { status: "unavailable" } // date hors des 5 jours de prévision
  | { status: "error"; message: string };

// Résultat d'une requête, étiqueté avec les paramètres qui l'ont produit.
type WeatherResult = {
  key: string;
  state: Exclude<WeatherState, { status: "loading" }>;
};

function requestKey(latitude: number, longitude: number, isoDate: string): string {
  return `${latitude}|${longitude}|${isoDate}`;
}

/** Charge la prévision d'un lieu à une date (requête : se déclenche toute seule). */
export function useWeather(latitude: number, longitude: number, isoDate: string): WeatherState {
  const [result, setResult] = useState<WeatherResult | null>(null);

  // Dépendances primitives (nombres, chaîne) : un objet location recréé à chaque rendu
  // aurait une nouvelle référence et relancerait l'appel en boucle.
  useEffect(() => {
    let isCancelled = false; // passe à true si l'écran est quitté ou si le lieu change avant la réponse
    const key = requestKey(latitude, longitude, isoDate);

    // setState uniquement dans les callbacks, quand la réponse arrive : jamais directement dans l'effet.
    getForecastAt(latitude, longitude, isoDate)
      .then((forecast) => {
        if (isCancelled) return; // réponse périmée : on l'ignore
        setResult({ key, state: forecast === null ? { status: "unavailable" } : { status: "success", forecast } });
      })
      .catch((error: unknown) => {
        if (isCancelled) return;
        setResult({ key, state: { status: "error", message: getErrorMessage(error, "Météo indisponible.") } });
      });

    // Nettoyage : appelé avant le prochain effet et au démontage du composant.
    return () => {
      isCancelled = true;
    };
  }, [latitude, longitude, isoDate]);

  // "loading" n'est pas stocké : il est déduit. Pas encore de résultat, ou un résultat qui concerne
  // d'anciens paramètres (le lieu vient de changer) : la bonne réponse n'est pas encore arrivée.
  if (result === null || result.key !== requestKey(latitude, longitude, isoDate)) {
    return { status: "loading" };
  }
  return result.state;
}
