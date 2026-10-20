import { StyleSheet, Text } from "react-native";
import { HAND_TEXT_END, theme } from "@/constants/theme";

type HeaderTitleProps = {
  children: string; // le titre de l'écran, fourni par le navigator
  size: number;
};

/**
 * Titre d'en-tête manuscrit. Remplace le titre par défaut du navigator pour pouvoir ajouter
 * HAND_TEXT_END : sans elle, Android rogne la dernière lettre ("Profi" au lieu de "Profil").
 */
export function HeaderTitle({ children, size }: HeaderTitleProps) {
  return (
    <Text style={[styles.title, { fontSize: size }]} numberOfLines={1}>
      {`${children}${HAND_TEXT_END}`}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: theme.fonts.hand, color: theme.colors.primary },
});
