import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import {
  hasErrors,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirmation,
} from "@/utils/validation";

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmation?: string;
};

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nextErrors: RegisterErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmation: validatePasswordConfirmation(password, confirmation),
    };
    setErrors(nextErrors);
    setSubmitError(null);
    if (hasErrors(nextErrors)) return;

    setIsSubmitting(true);
    try {
      // En cas de succès, la session est ouverte et le guard redirige vers les onglets.
      await signUp({ name, email, password });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // padding : le contenu remonte de la hauteur du clavier (testé sur Android en edge-to-edge).
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>

        <Input label="Nom" value={name} onChangeText={setName} error={errors.name} autoComplete="name" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="nom@exemple.fr"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          autoComplete="new-password"
        />
        <Input
          label="Confirmer le mot de passe"
          value={confirmation}
          onChangeText={setConfirmation}
          error={errors.confirmation}
          secureTextEntry
          autoComplete="new-password"
        />

        {submitError !== null && <Text style={styles.submitError}>{submitError}</Text>}

        <Button title="S'inscrire" onPress={handleSubmit} loading={isSubmitting} />

        <Link href="/login" style={styles.link}>
          Déjà un compte ? Se connecter
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  // flexGrow et non flex : le contenu peut dépasser l'écran et défiler quand le clavier est ouvert.
  container: { flexGrow: 1, justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.md },
  title: { fontSize: theme.fontSize.xl, fontWeight: "700", color: theme.colors.primary, textAlign: "center", marginBottom: theme.spacing.md },
  submitError: { fontSize: theme.fontSize.sm, color: theme.colors.danger, textAlign: "center" },
  link: { fontSize: theme.fontSize.md, color: theme.colors.primary, textAlign: "center" },
});