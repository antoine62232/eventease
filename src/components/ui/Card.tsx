import type { ReactNode } from "react";
import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

type CardProps = {
  children: ReactNode;
  onPress?: () => void; // sans onPress, la carte est un simple conteneur non cliquable
  style?: StyleProp<ViewStyle>; // style complémentaire fourni par le parent
};

export function Card({ children, onPress, style }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress !== undefined ? "button" : undefined}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  pressed: { opacity: 0.85 },
});