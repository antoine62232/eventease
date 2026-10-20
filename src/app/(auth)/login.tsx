import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PaperBackground } from "@/components/ui/PaperBackground";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";
import { hasErrors, validateEmail } from "@/utils/validation";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({}); // erreurs de format, sous chaque champ
  const [submitError, setSubmitError] = useState<string | null>(null); // erreur renvoyée par le service
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 1. Validation locale : on ne sollicite pas le service si le formulaire est invalide.
    const nextErrors: LoginErrors = {
      email: validateEmail(email),
      // À la connexion, on vérifie seulement la présence : la longueur est contrôlée à l'inscription.
      password: password === "" ? "Le mot de passe est obligatoire." : undefined,
    };
    setErrors(nextErrors);
    setSubmitError(null);
    if (hasErrors(nextErrors)) return;

    // 2. Appel au Context. En cas de succès, le guard redirige : rien d'autre à faire ici.
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaperBackground>
      {/* edges top : l'écran n'a pas d'en-tête, sans ça le titre peut passer sous la barre d'état. */}
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <KeyboardAvoidingView style={styles.screen} behavior="padding">
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>EventEase</Text>
            <Text style={styles.subtitle}>Connecte-toi pour voir les événements</Text>

            <Card tape="pink" style={styles.formCard}>
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
                autoComplete="password"
              />

              {submitError !== null && <Text style={styles.submitError}>{submitError}</Text>}
            </Card>

            <Button title="Se connecter" onPress={handleSubmit} loading={isSubmitting} />

            <Link href="/register" style={styles.link}>
              Pas encore de compte ? S’inscrire
            </Link>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, // transparent : laisse voir le quadrillage
  container: { flexGrow: 1, justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.md },
  title: { fontFamily: theme.fonts.hand, fontSize: 56, lineHeight: 64, color: theme.colors.primary, textAlign: "center" },
  subtitle: { fontFamily: theme.fonts.body, fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center", marginBottom: theme.spacing.md },
  submitError: { fontFamily: theme.fonts.bodyMedium, fontSize: theme.fontSize.sm, color: theme.colors.danger, textAlign: "center" },
  formCard: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  link: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.primary, textAlign: "center", textDecorationLine: "underline" },
});