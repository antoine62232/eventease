import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { theme } from "@/constants/theme";

type ParticipationToggleProps = {
  isParticipating: boolean;
  isPast: boolean;
  // Contrat : le parent gère ses erreurs lui-même, cette fonction ne doit pas rejeter.
  onToggle: () => Promise<void>;
};

export function ParticipationToggle({ isParticipating, isPast, onToggle }: ParticipationToggleProps) {
  // Seul état local : l'écriture en cours. La participation elle-même vient du parent.
  const [isPending, setIsPending] = useState(false);

  const handlePress = async () => {
    setIsPending(true);
    try {
      await onToggle();
    } finally {
      // finally : le bouton redevient actif dans tous les cas, succès ou échec.
      setIsPending(false);
    }
  };

  // Libellés adaptés au temps de l'événement : "participe" avant, "participé" après.
  let statusText: string;
  if (isParticipating) {
    statusText = isPast ? "Tu as participé à cet événement." : "Tu participes à cet événement.";
  } else {
    statusText = isPast ? "Tu n'as pas marqué ta participation." : "Tu ne participes pas encore.";
  }

  const buttonTitle = isParticipating
    ? "Retirer ma participation"
    : isPast
      ? "Marquer comme participé"
      : "Je participe";

  return (
    <View style={styles.container}>
      <Text style={[styles.status, isParticipating && styles.statusActive]}>{statusText}</Text>
      <Button
        title={buttonTitle}
        // Action principale si on ne participe pas, secondaire pour l'annuler.
        variant={isParticipating ? "secondary" : "primary"}
        loading={isPending}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  status: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  statusActive: {
    color: theme.colors.success,
    fontWeight: "600",
  },
});