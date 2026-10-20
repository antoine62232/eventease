/** Prévision retenue pour un événement, déjà convertie dans nos unités. */
export type Forecast = {
  temperature: number; // °C, arrondie
  description: string; // "ciel dégagé", en français
  iconUrl: string; // image fournie par OpenWeather
  forecastAt: string; // ISO UTC : le créneau de 3 h retenu
};
