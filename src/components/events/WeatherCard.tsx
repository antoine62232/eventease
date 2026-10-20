import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { useWeather } from "@/hooks/useWeather";
import type { EventLocation } from "@/types/event";
import { formatTime } from "@/utils/dates";

type WeatherCardProps = {
  location: EventLocation;
  date: string; // ISO de l'événement
};

/** Météo prévue au lieu et à l'heure de l'événement, présentée comme un post-it collé sur la page. */
export function WeatherCard({ location, date }: WeatherCardProps) {
  const weather = useWeather(location.latitude, location.longitude, date);

  return (
    <View style={styles.postIt} accessibilityLabel="Météo prévue">
      {weather.status === "loading" && <ActivityIndicator color={theme.colors.highlighterText} />}

      {weather.status === "unavailable" && (
        <Text style={styles.hand}>météo dispo 5 jours avant</Text>
      )}

      {weather.status === "error" && <Text style={styles.small}>{weather.message}</Text>}

      {weather.status === "success" && (
        <>
          <Text style={styles.hand}>météo à {formatTime(weather.forecast.forecastAt)}</Text>
          <View style={styles.row}>
            <Text style={styles.temperature}>{weather.forecast.temperature}°</Text>
            <Image source={{ uri: weather.forecast.iconUrl }} style={styles.icon} accessibilityIgnoresInvertColors />
          </View>
          <Text style={styles.hand}>{weather.forecast.description}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postIt: {
    width: 140,
    minHeight: 140,
    padding: theme.spacing.sm + 4,
    justifyContent: "space-between",
    backgroundColor: theme.colors.highlighter,
    transform: [{ rotate: "4deg" }], // collé un peu de travers, comme un vrai post-it
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  row: { flexDirection: "row", alignItems: "center" },
  temperature: { fontFamily: theme.fonts.bodyBold, fontSize: 38, color: theme.colors.highlighterText },
  icon: { width: 44, height: 44 },
  hand: { fontFamily: theme.fonts.hand, fontSize: 20, lineHeight: 22, color: theme.colors.highlighterText },
  small: { fontFamily: theme.fonts.body, fontSize: theme.fontSize.sm, color: theme.colors.highlighterText },
});
