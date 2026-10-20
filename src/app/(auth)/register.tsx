import { Link } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PaperBackground } from "@/components/ui/PaperBackground";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";
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
  // Référence vers le ScrollView, pour le faire défiler quand le clavier cache les derniers champs.
  const scrollRef = useRef<ScrollView>(null);

  // Le clavier met un instant à s'ouvrir : on attend la fin de son animation avant de défiler.
  const revealBottomFields = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
  };

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
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaperBackground>
      {/* edges top : l'écran n'a pas d'en-tête, sans ça le titre passe sous la barre d'état. */}
      <SafeAreaView style={styles.screen} edges={["top"]}>
        {/* padding : le contenu remonte de la hauteur du clavier (testé sur Android en edge-to-edge). */}
        <KeyboardAvoidingView style={styles.screen} behavior="padding">
          <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Créer un compte</Text>

            <Card tape="mint" style={styles.formCard}>
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
                onFocus={revealBottomFields}
              />
              <Input
                label="Confirmer le mot de passe"
                value={confirmation}
                onChangeText={setConfirmation}
                error={errors.confirmation}
                secureTextEntry
                autoComplete="new-password"
                onFocus={revealBottomFields}
              />

              {submitError !== null && <Text style={styles.submitError}>{submitError}</Text>}
            </Card>

            <Button title="S'inscrire" onPress={handleSubmit} loading={isSubmitting} />

            <Link href="/login" style={styles.link}>
              Déjà un compte ? Se connecter
            </Link>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, // transparent : laisse voir le quadrillage
  // flexGrow et non flex : le contenu peut dépasser l'écran et défiler quand le clavier est ouvert.
  container: { flexGrow: 1, justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.md },
  title: { fontFamily: theme.fonts.hand, fontSize: 56, lineHeight: 64, color: theme.colors.primary, textAlign: "center" },
  submitError: { fontFamily: theme.fonts.bodyMedium, fontSize: theme.fontSize.sm, color: theme.colors.danger, textAlign: "center" },
  formCard: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  link: { fontFamily: theme.fonts.hand, fontSize: 22, color: theme.colors.primary, textAlign: "center", textDecorationLine: "underline" },
});