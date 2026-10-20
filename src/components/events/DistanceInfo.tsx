import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { EventLocation } from "@/types/event";
import { distanceKm, formatDistance } from "@/utils/distance";

type DistanceInfoProps = {
  location: EventLocation;
};

/** "À 3,2 km de toi", ou un message clair si la position n'est pas disponible. */
export function DistanceInfo({ location }: DistanceInfoProps) {
  const userLocation = useUserLocation();

  let text: string;
  switch (userLocation.status) {
    case "loading":
      text = "Calcul de la distance...";
      break;
    case "success":
      text = `à ${formatDistance(distanceKm(userLocation.coords, location))} de toi`;
      break;
    case "denied":
      text = "Autorise la localisation dans les réglages pour voir la distance.";
      break;
    case "error":
      text = "Position indisponible : vérifie que la localisation est activée.";
      break;
  }

  // Les messages d'aide restent en texte droit : ce sont des consignes, elles doivent se lire du premier coup.
  if (userLocation.status !== "success") {
    return <Text style={styles.help}>{text}</Text>;
  }

  // La distance s'écrit "à la main", comme une annotation, avec sa précision en petit dessous.
  return (
    <View>
      <Text style={styles.annotation}>{text}</Text>
      <Text style={styles.help}>à vol d’oiseau</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  annotation: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.primary },
  help: { fontFamily: theme.fonts.body, fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
});
