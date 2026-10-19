import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean; // affiche un indicateur à la place du texte (ex : pendant une sauvegarde)
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: ButtonProps) {
  // Pendant un chargement, le bouton est inactif : évite le double envoi d'un formulaire.
  const isInactive = disabled || loading;
  const textColor = variant === "secondary" ? theme.colors.primary : theme.colors.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      // style en fonction : React Native nous donne pressed, sans useState.
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        isInactive && styles.inactive,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48, // zone tactile confortable pour un doigt
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: theme.fontSize.md, fontWeight: "600" },
  pressed: { opacity: 0.8 },
  inactive: { opacity: 0.5 },
});

// Un style par variante : le type ButtonVariant garantit qu'aucune n'est oubliée.
const variantStyles = StyleSheet.create({
  primary: { backgroundColor: theme.colors.primary },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  danger: { backgroundColor: theme.colors.danger },
});