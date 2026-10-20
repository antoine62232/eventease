import "@/constants/calendarLocale"; // import pour son effet : traduit le calendrier en français
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import { CalendarDay } from "@/components/events/CalendarDay";
import { EventCard } from "@/components/events/EventCard";
import { Card } from "@/components/ui/Card";
import { PaperBackground } from "@/components/ui/PaperBackground";
import { HAND_TEXT_END, theme } from "@/constants/theme";
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
    <PaperBackground>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={dayEvents}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Le calendrier sur une fiche avec ruban, comme une page du carnet. */}
            <Card tilt={-0.5} tape="mint" style={styles.calendarCard}>
              <Calendar
                current={selectedDay}
                markedDates={markedDates}
                // dateString : le jour touché, déjà au format "YYYY-MM-DD".
                onDayPress={(day: DateData) => setSelectedDay(day.dateString)}
                dayComponent={CalendarDay} // nos propres cases : marqueur, cercle au stylo
                // Titre du mois rendu par nous. date est un objet XDate (la librairie de dates de
                // react-native-calendars), déjà en français. Espace insécable final : voir HAND_TEXT_END.
                renderHeader={(date) => (
                  <Text style={styles.monthTitle}>{`${date?.toString("MMMM yyyy") ?? ""}${HAND_TEXT_END}`}</Text>
                )}
                firstDay={1} // semaine qui commence le lundi, comme en France
                enableSwipeMonths
                theme={{
                  calendarBackground: "transparent",
                  arrowColor: theme.colors.primary,
                  textSectionTitleColor: theme.colors.textMuted,
                  textDayHeaderFontFamily: theme.fonts.hand,
                  textDayHeaderFontSize: 18,
                }}
              />
            </Card>
            <Text style={styles.dayTitle}>{selectedTitle} :</Text>
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
        ListEmptyComponent={<Text style={styles.empty}>Rien de prévu ce jour-là.</Text>}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: "transparent" }, // laisse voir le quadrillage
  // Espace entre les fiches : les rubans dépassent au-dessus de chacune, comme dans la liste.
  content: { padding: theme.spacing.lg, paddingTop: theme.spacing.xl, gap: theme.spacing.xl },
  header: { gap: theme.spacing.lg },
  calendarCard: { paddingHorizontal: theme.spacing.xs },
  monthTitle: { fontFamily: theme.fonts.hand, fontSize: 30, color: theme.colors.text },
  dayTitle: { fontFamily: theme.fonts.hand, fontSize: 26, color: theme.colors.text },
  empty: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.textMuted, textAlign: "center" },
});
