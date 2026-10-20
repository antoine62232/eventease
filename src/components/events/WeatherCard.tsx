import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { useWeather } from "@/hooks/useWeather";
import type { EventLocation } from "@/types/event";
import { formatTime } from "@/utils/dates";
import { capitalize } from "@/utils/weather";

type WeatherCardProps = {
  location: EventLocation;
  date: string; // ISO de l'événement
};

/** Météo prévue au lieu et à l'heure de l'événement. */
export function WeatherCard({ location, date }: WeatherCardProps) {
  const weather = useWeather(location.latitude, location.longitude, date);

  return (
    <Card>
      <Text style={styles.title}>Météo prévue</Text>

      {weather.status === "loading" && <ActivityIndicator color={theme.colors.primary} />}

      {weather.status === "unavailable" && (
        <Text style={styles.muted}>Prévisions disponibles dans les 5 jours qui précèdent l'événement.</Text>
      )}

      {weather.status === "error" && <Text style={styles.muted}>{weather.message}</Text>}

      {weather.status === "success" && (
        <View style={styles.row}>
          <Image source={{ uri: weather.forecast.iconUrl }} style={styles.icon} accessibilityIgnoresInvertColors />
          <View style={styles.texts}>
            <Text style={styles.temperature}>{weather.forecast.temperature} °C</Text>
            <Text style={styles.description}>{capitalize(weather.forecast.description)}</Text>
            <Text style={styles.muted}>
              {location.label}, prévision de {formatTime(weather.forecast.forecastAt)}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: theme.fontSize.sm, fontWeight: "700", color: theme.colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  icon: { width: 64, height: 64 },
  texts: { flex: 1, gap: 2 },
  temperature: { fontSize: theme.fontSize.xl, fontWeight: "700", color: theme.colors.text },
  description: { fontSize: theme.fontSize.md, color: theme.colors.text },
  muted: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
});
