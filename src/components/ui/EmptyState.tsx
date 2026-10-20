import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string; // le bouton n'apparaît que si actionLabel ET onAction sont fournis
  onAction?: () => void;
};

/** Écran d'information : liste vide, erreur de chargement... avec une action facultative. */
export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel !== undefined && onAction !== undefined && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: { fontSize: theme.fontSize.lg, fontWeight: "700", color: theme.colors.text, textAlign: "center" },
  message: { fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center" },
});