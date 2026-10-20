import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CalendarProps } from "react-native-calendars";
import { theme } from "@/constants/theme";

// Props que react-native-calendars passe à un dayComponent, lues depuis son propre type :
// pas d'import d'un fichier interne de la librairie, qui pourrait changer de place.
type CalendarDayProps = ComponentProps<NonNullable<CalendarProps["dayComponent"]>>;

/**
 * Case d'un jour, dessinée à la main : jours avec événement surlignés au marqueur,
 * jour sélectionné entouré au stylo, aujourd'hui annoté "auj.".
 */
export function CalendarDay({ date, state, marking, onPress }: CalendarDayProps) {
  if (date === undefined) {
    return <View style={styles.cell} />;
  }

  const isSelected = marking?.selected === true;
  const hasEvent = marking?.marked === true;
  const isToday = state === "today";
  const isOtherMonth = state === "disabled" || state === "inactive";

  return (
    <Pressable
      onPress={() => onPress?.(date)}
      accessibilityRole="button"
      accessibilityLabel={`${date.day}${hasEvent ? ", avec un événement" : ""}`}
      accessibilityState={{ selected: isSelected }}
      style={styles.cell}
    >
      {hasEvent && <View style={styles.highlight} />}
      {isSelected && <View style={styles.penCircle} />}
      <Text style={[styles.day, (hasEvent || isSelected) && styles.dayBold, isOtherMonth && styles.dayOther]}>
        {date.day}
      </Text>
      {isToday && <Text style={styles.today}>auj.</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  // Trait de marqueur : rectangle jaune légèrement penché derrière le numéro.
  highlight: {
    position: "absolute",
    width: 32,
    height: 24,
    backgroundColor: theme.colors.highlighter,
    transform: [{ rotate: "-3deg" }],
  },
  // Cercle au stylo : coins de rayons différents + rotation, pour un rond "pas parfait".
  penCircle: {
    position: "absolute",
    width: 40,
    height: 36,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 21,
    borderBottomLeftRadius: 17,
    transform: [{ rotate: "-8deg" }],
  },
  day: { fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.text },
  dayBold: { fontFamily: theme.fonts.bodyBold },
  dayOther: { color: theme.colors.border },
  // Sous la case, pour ne pas chevaucher le cercle quand aujourd'hui est aussi le jour sélectionné.
  today: {
    position: "absolute",
    bottom: -12,
    fontFamily: theme.fonts.hand,
    fontSize: 15,
    color: theme.colors.primary,
  },
});
