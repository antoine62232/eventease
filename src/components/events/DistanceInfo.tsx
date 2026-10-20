import { StyleSheet, Text } from "react-native";
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
      text = `À ${formatDistance(distanceKm(userLocation.coords, location))} de toi (à vol d'oiseau)`;
      break;
    case "denied":
      text = "Autorise la localisation dans les réglages pour voir la distance.";
      break;
    case "error":
      text = "Position indisponible : vérifie que la localisation est activée.";
      break;
  }

  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
});
