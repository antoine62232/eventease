import type { ReactNode } from "react";
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { theme } from "@/constants/theme";
import type { TapeColor } from "@/types/ui";

type CardProps = {
  children: ReactNode;
  onPress?: () => void; // sans onPress, la carte est un simple conteneur non cliquable
  style?: StyleProp<ViewStyle>; // style complémentaire fourni par le parent
  tilt?: number; // inclinaison en degrés, comme une fiche posée à la main (rester sous 1,5)
  tape?: TapeColor; // ruban adhésif en haut de la fiche
};

/** Fiche bristol : coins droits, ombre légère, inclinaison et ruban facultatifs. */
export function Card({ children, onPress, style, tilt = 0, tape }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress !== undefined ? "button" : undefined}
      style={({ pressed }) => [
        styles.card,
        { transform: [{ rotate: `${tilt}deg` }] },
        pressed && styles.pressed,
        style,
      ]}
    >
      {tape !== undefined && <View style={[styles.tape, tapeStyles[tape]]} />}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg, // place pour le ruban
    gap: theme.spacing.xs,
    // Ombre : propriétés shadow* pour iOS, elevation pour Android (qui ignore les shadow*).
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pressed: { opacity: 0.85 },
  tape: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -45, // moitié de la largeur : ruban centré
    width: 90,
    height: 22,
    transform: [{ rotate: "3deg" }],
    zIndex: 1,
  },
});

// Un style par couleur de ruban : le type TapeColor garantit qu'aucune n'est oubliée.
const tapeStyles = StyleSheet.create({
  pink: { backgroundColor: theme.colors.tapePink },
  mint: { backgroundColor: theme.colors.tapeMint },
  gray: { backgroundColor: theme.colors.tapeGray },
});
