import type { ReactNode } from "react";
import { type StyleProp, StyleSheet, Text, type TextStyle, View } from "react-native";
import { theme } from "@/constants/theme";

type HighlightProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>; // style du texte (taille, police)
};

/**
 * Texte surligné au marqueur. Pas de dégradé CSS en React Native :
 * une bande jaune est placée en absolu derrière la moitié basse du texte.
 */
export function Highlight({ children, style }: HighlightProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.band} />
      <Text style={[styles.text, style]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // alignSelf : le surlignage prend la largeur du texte, pas toute la ligne.
  wrapper: { alignSelf: "flex-start", paddingHorizontal: theme.spacing.xs },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 2,
    height: "50%",
    backgroundColor: theme.colors.highlighter,
  },
  text: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.text },
});
