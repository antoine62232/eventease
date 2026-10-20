// src/constants/config.ts

// Lue dans .env.local au démarrage de Metro. Le préfixe EXPO_PUBLIC_ est obligatoire pour qu'Expo
// l'intègre au bundle : elle finit donc DANS l'app, ce n'est pas un vrai secret (voir README).
export const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "";

export const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";
