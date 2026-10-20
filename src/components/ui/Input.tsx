import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { theme } from "@/constants/theme";

// On hérite de toutes les props natives de TextInput (value, onChangeText,
// secureTextEntry, keyboardType...) et on ajoute les nôtres.
type InputProps = TextInputProps & {
  label: string;
  error?: string; // message affiché sous le champ si la validation échoue
};

export function Input({ label, error, style, ...rest }: InputProps) {
  const hasError = error !== undefined; // vrai booléen, jamais une chaîne dans le JSX

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        // style passé par le parent en dernier : il peut surcharger le nôtre
        style={[styles.input, hasError && styles.inputError, style]}
        placeholderTextColor={theme.colors.textMuted}
        {...rest}
      />
      {hasError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xs, alignSelf: "stretch" },
  label: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.text },
  input: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputError: { borderColor: theme.colors.danger },
  error: { fontFamily: theme.fonts.bodyMedium, fontSize: theme.fontSize.sm, color: theme.colors.danger },
});