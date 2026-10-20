# EventEase

Application mobile de l'association EventEase. Les membres consultent les événements (conférences, ateliers, sorties), en créent et indiquent leur participation.

Prototype réalisé en 4 jours dans le cadre de la formation Concepteur Développeur d'Applications.

## Fonctionnalités

- Inscription et connexion simulées, sans backend : mots de passe hachés (SHA-256 + sel) et stockés sur le téléphone
- Liste des événements triée par date : à venir d'abord, puis passés
- Création, modification et suppression d'un événement, avec confirmation. Seul le créateur peut modifier ou supprimer
- Participation par membre : chaque utilisateur indique lui-même s'il participe
- Persistance locale avec AsyncStorage : les données restent après fermeture de l'app
- Calendrier mensuel avec les jours qui ont un événement
- Lieu d'un événement, avec la météo prévue sur place (OpenWeather) et la distance depuis la position de l'utilisateur
- Thème centralisé, icônes natives, icône d'app et splash screen

## Stack

- Expo SDK 57, React Native 0.86, TypeScript en mode strict
- Expo Router, construit sur React Navigation
- Context API pour l'état global
- AsyncStorage pour la persistance
- react-native-calendars, expo-location, expo-crypto, expo-symbols
- API OpenWeather : géocodage et prévisions sur 5 jours

## Prérequis

- Node.js en version LTS
- L'app Expo Go sur un téléphone Android ou iOS
- Une clé API OpenWeather gratuite : https://home.openweathermap.org/api_keys

## Installation

```bash
git clone https://github.com/antoine62232/eventease.git
cd eventease
npm install
```

Copier `.env.example` en `.env.local` et y mettre la clé OpenWeather :

```
EXPO_PUBLIC_OPENWEATHER_API_KEY=ta_cle
```

`.env.local` est ignoré par Git. Sans clé, l'app fonctionne, mais la recherche de lieu et la météo affichent un message d'erreur.

## Lancement

```bash
npx expo start
```

Scanner le QR code avec Expo Go. Le PC et le téléphone doivent être sur le même réseau. Si le réseau isole les appareils (Wi-Fi public ou d'entreprise), utiliser `npx expo start --tunnel`, ou connecter le PC au point d'accès du téléphone.

En développement, le bouton « Créer des événements de test » de l'onglet Profil ajoute trois événements, dont deux avec un lieu.

## Vérifications

```bash
npx tsc --noEmit   # typage
npm run lint       # ESLint (eslint-config-expo)
```

## Architecture

```
src/
├─ app/          Écrans et routes (Expo Router) : (auth), (tabs), event/[id], event/form
├─ components/
│  ├─ ui/        Composants génériques : Button, Input, Card, EmptyState, TabIcon
│  └─ events/    Composants métier : EventCard, EventForm, ParticipationToggle, WeatherCard, DistanceInfo
├─ context/      AuthContext, EventsContext
├─ hooks/        useAuth, useEvents, useWeather, useGeocoding, useUserLocation
├─ services/     Accès aux données : storage, authService, eventService, weatherService, geocodingService, locationService
├─ types/        Modèles : AppEvent, User, Forecast
├─ constants/    Thème, clés de stockage, configuration
└─ utils/        Fonctions pures : dates, validation, distance, calendrier, participation
```

Règle suivie partout : un écran n'appelle jamais le stockage ni une API directement. Le chemin est toujours écran → hook → service → stockage ou API.

Le document technique détaille les choix : [docs/document-technique.md](docs/document-technique.md).

## Limites connues

- L'authentification est une simulation : les comptes sont sur le téléphone, sans serveur. En production, un backend vérifierait les identifiants et émettrait un jeton.
- La clé OpenWeather est intégrée à l'app compilée (variable `EXPO_PUBLIC_`) : elle n'est pas secrète. En production, l'appel passerait par un backend qui détient la clé.
- Les prévisions gratuites couvrent 5 jours. Au-delà, l'app l'indique au lieu d'afficher une météo.
- Expo Go affiche son propre écran de démarrage : l'icône et le splash d'EventEase ne sont visibles que dans un build compilé (EAS Build, profil `preview`).
