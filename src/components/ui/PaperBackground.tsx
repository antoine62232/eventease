import type { ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type PaperBackgroundProps = {
  children: ReactNode;
};

/**
 * Fond de papier quadrillé. React Native n'a pas de dégradés CSS pour dessiner des lignes :
 * on répète une petite image de 22 px (un carreau). grid@2x et grid@3x sont choisies seules selon l'écran.
 */
export function PaperBackground({ children }: PaperBackgroundProps) {
  return (
    <ImageBackground
      // require : la manière standard de React Native pour embarquer une image locale dans le bundle.
      source={require("@/assets/images/grid.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: theme.colors.background },
});
