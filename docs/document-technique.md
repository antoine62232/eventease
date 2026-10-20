# EventEase : document technique

EventEase est une app Expo SDK 57 en TypeScript strict. La navigation utilise Expo Router, construit sur React Navigation : chaque `_layout.tsx` déclare un Stack ou un Tabs navigator.

Le code suit quatre couches : écrans (`app/`), hooks, services, stockage ou API. Un écran n'accède jamais directement à AsyncStorage ni à `fetch`. Les calculs (dates, distance, validation) sont des fonctions pures dans `utils/`, testables isolément.

L'état global tient dans deux Contexts, AuthContext et EventsContext. Redux ou Zustand seraient surdimensionnés pour deux sources de données. Le React Compiler, activé, mémoïse les rendus sans `useMemo` manuel.

La persistance utilise AsyncStorage avec du JSON, dates en ISO UTC. Une migration à la lecture complète les anciens événements sans lieu.

L'authentification est simulée : mot de passe haché en SHA-256 avec un sel aléatoire (expo-crypto), session restaurée au démarrage. Les écrans protégés passent par `Stack.Protected`, et le splash reste affiché tant que la session n'est pas lue.

Les règles métier sont vérifiées dans le service et répétées dans l'interface : seul le créateur modifie ou supprime, et chaque membre gère sa propre participation (`participantIds`).

Bonus : calendrier (react-native-calendars), météo et géocodage (OpenWeather, clé dans `.env.local`), distance par la formule de haversine (expo-location). Les états de chargement, d'erreur et de permission refusée sont tous gérés.
