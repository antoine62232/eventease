import "@/constants/calendarLocale"; // import pour son effet : traduit le calendrier en français
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import { EventCard } from "@/components/events/EventCard";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { buildMarkedDates, eventsOnDay } from "@/utils/calendar";
import { formatDay, toLocalDayKey } from "@/utils/dates";
import { paperDecor } from "@/utils/paper";
import { isUserParticipating } from "@/utils/participation";

export default function CalendarScreen() {
  const { user } = useAuth();
  const { events } = useEvents();

  // Jour sélectionné au format "YYYY-MM-DD". Par défaut : aujourd'hui.
  const [selectedDay, setSelectedDay] = useState(() => toLocalDayKey(new Date().toISOString()));

  // Valeurs dérivées, recalculées à chaque rendu : pas de state en double à synchroniser.
  const markedDates = buildMarkedDates(events, selectedDay);
  const dayEvents = eventsOnDay(events, selectedDay);

  // "YYYY-MM-DD" à midi local : évite tout décalage de jour à l'affichage du titre.
  const selectedTitle = formatDay(new Date(`${selectedDay}T12:00:00`).toISOString());

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={dayEvents}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Calendar
            current={selectedDay}
            markedDates={markedDates}
            // dateString : le jour touché, déjà au format "YYYY-MM-DD".
            onDayPress={(day: DateData) => setSelectedDay(day.dateString)}
            firstDay={1} // semaine qui commence le lundi, comme en France
            enableSwipeMonths
            theme={{
              todayTextColor: theme.colors.primary,
              selectedDotColor: theme.colors.primaryText, // point blanc sur le jour surligné
              arrowColor: theme.colors.primary,
              textSectionTitleColor: theme.colors.textMuted,
              monthTextColor: theme.colors.text,
              textMonthFontWeight: "700",
            }}
            style={styles.calendar}
          />
          <Text style={styles.dayTitle}>{selectedTitle}</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <EventCard
          {...paperDecor(index)}
          event={item}
          isParticipating={isUserParticipating(item, user?.id)}
          onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
        />
      )}
      ListEmptyComponent={<Text style={styles.empty}>Aucun événement ce jour-là.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, gap: theme.spacing.md },
  header: { gap: theme.spacing.md },
  calendar: { borderRadius: theme.radius.md, overflow: "hidden" },
  dayTitle: { fontSize: theme.fontSize.md, fontWeight: "700", color: theme.colors.text },
  empty: { fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center" },
});
