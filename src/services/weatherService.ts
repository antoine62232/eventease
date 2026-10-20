import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from "@/constants/config";
import type { Forecast } from "@/types/weather";
import { findClosestSlotIndex } from "@/utils/weather";

// Réponse de /data/2.5/forecast, réduite aux champs utilisés.
type ForecastResponse = {
  list: {
    dt: number; // secondes depuis 1970, UTC
    main: { temp: number };
    weather: { description: string; icon: string }[];
  }[];
};

/**
 * Prévision au plus près de la date de l'événement, ou null si la date est hors des 5 jours couverts.
 * Lève une erreur en cas de problème réseau ou de clé.
 */
export async function getForecastAt(latitude: number, longitude: number, isoDate: string): Promise<Forecast | null> {
  if (OPENWEATHER_API_KEY === "") {
    throw new Error("Clé OpenWeather manquante.");
  }

  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    units: "metric", // degrés Celsius au lieu de Kelvin
    lang: "fr", // descriptions en français
    appid: OPENWEATHER_API_KEY,
  });

  let response: Response;
  try {
    response = await fetch(`${OPENWEATHER_BASE_URL}/data/2.5/forecast?${params.toString()}`);
  } catch {
    throw new Error("Pas de connexion : météo indisponible.");
  }
  if (!response.ok) {
    throw new Error("Service météo indisponible.");
  }

  const data = (await response.json()) as ForecastResponse;

  // dt est en secondes, Date travaille en millisecondes.
  const slots = data.list.map((item) => item.dt * 1000);
  const index = findClosestSlotIndex(slots, new Date(isoDate).getTime());
  if (index === -1) return null;

  const item = data.list[index];
  const weather = item.weather[0];
  return {
    temperature: Math.round(item.main.temp),
    description: weather?.description ?? "",
    iconUrl: `https://openweathermap.org/img/wn/${weather?.icon ?? "01d"}@2x.png`,
    forecastAt: new Date(slots[index]).toISOString(),
  };
}
