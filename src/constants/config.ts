// Lue dans .env.local au démarrage de Metro. Le préfixe EXPO_PUBLIC_ est obligatoire pour qu'Expo
// l'intègre au bundle : elle finit donc DANS l'app, ce n'est pas un vrai secret (voir README).
export const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "";

export const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";

// Mode démo : activé uniquement dans l'APK de soutenance (profil "preview" de eas.json).
// Il affiche le bouton de données de test, sinon absent d'une app compilée.
export const IS_DEMO = process.env.EXPO_PUBLIC_DEMO === "true";
