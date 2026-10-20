// Direction visuelle "carnet quadrillé" : encre bleue sur papier, marqueur jaune, rubans adhésifs.
const colors = {
  primary: "#1C2E6B", // encre : boutons, liens, titres
  primaryText: "#FFFFFF", // texte posé sur l'encre
  background: "#FCFCFA", // papier
  surface: "#FFFFFF", // fiches et champs
  text: "#1C2E6B",
  textMuted: "#45507A", // 7:1 sur blanc : reste lisible pour les textes secondaires
  border: "#D5DCEA",
  success: "#1F6E4A", // participation confirmée
  danger: "#B4232F",
  grid: "#E3E9F3", // lignes du quadrillage
  highlighter: "#FFE45C", // marqueur jaune
  highlighterText: "#2B2405", // texte posé sur le jaune
  tapePink: "rgba(255, 150, 180, 0.7)", // rubans adhésifs, semi-transparents
  tapeMint: "rgba(140, 220, 190, 0.75)",
  tapeGray: "rgba(70, 78, 100, 0.55)", // ruban des fiches d'événements passés
  pastCard: "#E2E5EC", // fiche d'un événement passé : nettement plus sombre que le blanc des fiches à venir
} as const;

// Avec une police personnalisée, fontWeight ne choisit pas la graisse sur Android :
// chaque graisse est une famille à part, chargée au démarrage (voir src/app/_layout.tsx).
const fonts = {
  hand: "Caveat_700Bold", // écriture manuscrite : titres et petites touches uniquement, 20 px minimum
  handMedium: "Caveat_500Medium",
  body: "InterTight_400Regular", // tout le texte utile
  bodyMedium: "InterTight_500Medium",
  bodySemiBold: "InterTight_600SemiBold",
  bodyBold: "InterTight_700Bold",
} as const;

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

const radius = { sm: 6, md: 12, lg: 20 } as const;

const fontSize = { sm: 13, md: 16, lg: 20, xl: 28, hand: 24, handLg: 34, handXl: 48 } as const;

export const theme = { colors, fonts, spacing, radius, fontSize } as const;
