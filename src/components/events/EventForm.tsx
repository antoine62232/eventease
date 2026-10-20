// src/components/events/EventForm.tsx
import DateTimePicker, { type DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useGeocoding } from "@/hooks/useGeocoding";
import { theme } from "@/constants/theme";
import type { EventInput, EventLocation } from "@/types/event";
import { formatDay, formatTime, withDatePart, withTimePart } from "@/utils/dates";
import {
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_LOCATION_MAX_LENGTH,
  EVENT_TITLE_MAX_LENGTH,
  hasErrors,
  validateEventDescription,
  validateEventTitle,
  validateFutureDate,
} from "@/utils/validation";

type EventFormProps = {
  initialValues: EventInput; // lues au premier rendu uniquement (voir le piège de useState)
  submitLabel: string;
  allowPastDate: boolean; // false à la création, true à la modification
  onSubmit: (input: EventInput) => Promise<void>; // l'écran décide : créer ou modifier
};

type EventFormErrors = {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
};

type PickerMode = "date" | "time";

export function EventForm({ initialValues, submitLabel, allowPastDate, onSubmit }: EventFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  // Ce que l'utilisateur tape. Le lieu géocodé n'est calculé qu'à l'envoi.
  const [locationQuery, setLocationQuery] = useState(initialValues.location?.label ?? "");
  const { geocode, isGeocoding } = useGeocoding();
  // Le sélecteur travaille avec un objet Date : on convertit l'ISO une fois, au départ.
  const [date, setDate] = useState(() => new Date(initialValues.date));
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null); // null = sélecteur fermé
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Choix validé. Android : le dialogue se ferme après chaque choix, on démonte le composant.
  const handlePickerValueChange = (_event: DateTimePickerChangeEvent, picked: Date) => {
    const mode = pickerMode;
    setPickerMode(null);
    if (mode === null) return;
    // On ne remplace que la partie choisie : le jour OU l'heure.
    setDate((current) => (mode === "date" ? withDatePart(current, picked) : withTimePart(current, picked)));
  };

  // Annulation : on ferme simplement, sans rien changer.
  const handlePickerDismiss = () => setPickerMode(null);

  const handleSubmit = async () => {
    const isoDate = date.toISOString();
    const nextErrors: EventFormErrors = {
      title: validateEventTitle(title),
      description: validateEventDescription(description),
      date: allowPastDate ? undefined : validateFutureDate(isoDate),
    };
    setErrors(nextErrors);
    setSubmitError(null);
    if (hasErrors(nextErrors)) return; // nextErrors, pas errors : errors n'est pas encore à jour

    // Le lieu : champ vide = pas de lieu ; texte inchangé = on garde le lieu déjà connu, sans appel réseau.
    let location: EventLocation | null = null;
    const query = locationQuery.trim();
    if (query !== "" && query === initialValues.location?.label) {
      location = initialValues.location;
    } else if (query !== "") {
      try {
        location = await geocode(query);
      } catch (error) {
        setErrors({ ...nextErrors, location: error instanceof Error ? error.message : "Lieu introuvable." });
        return; // on n'enregistre pas un lieu qu'on n'a pas pu vérifier
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, date: isoDate, location });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isoDate = date.toISOString();

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Input
          label="Titre"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          maxLength={EVENT_TITLE_MAX_LENGTH} // bloque la saisie au-delà, en plus de la validation
          placeholder="Atelier, conférence, sortie..."
        />

        <Input
          label="Description (facultative)"
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
          multiline
          textAlignVertical="top" // Android centre verticalement par défaut
          style={styles.descriptionInput}
        />

        <Input
          label="Lieu (facultatif)"
          value={locationQuery}
          onChangeText={setLocationQuery}
          error={errors.location}
          maxLength={EVENT_LOCATION_MAX_LENGTH}
          placeholder="Ville : Béthune, Lille..."
          autoCorrect={false}
        />

        <View style={styles.dateBlock}>
          <Text style={styles.label}>Date et heure</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateButton}>
              <Button title={formatDay(isoDate)} variant="secondary" onPress={() => setPickerMode("date")} />
            </View>
            <Button title={formatTime(isoDate)} variant="secondary" onPress={() => setPickerMode("time")} />
          </View>
          {errors.date !== undefined && <Text style={styles.error}>{errors.date}</Text>}
        </View>

        {/* Monté uniquement quand on en a besoin : sur Android, le monter ouvre le dialogue. */}
        {pickerMode !== null && (
          <DateTimePicker
            value={date}
            mode={pickerMode}
            is24Hour
            minimumDate={allowPastDate ? undefined : new Date()} // jours passés grisés à la création
            onValueChange={handlePickerValueChange}
            onDismiss={handlePickerDismiss}
          />
        )}

        {submitError !== null && <Text style={styles.submitError}>{submitError}</Text>}

        <Button title={submitLabel} onPress={handleSubmit} loading={isGeocoding || isSubmitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: theme.spacing.lg, gap: theme.spacing.md },
  descriptionInput: { minHeight: 120, paddingTop: theme.spacing.sm },
  dateBlock: { gap: theme.spacing.xs },
  label: { fontSize: theme.fontSize.sm, fontWeight: "600", color: theme.colors.text },
  dateRow: { flexDirection: "row", gap: theme.spacing.sm },
  dateButton: { flex: 1 }, // le jour prend la place restante, l'heure garde sa largeur
  error: { fontSize: theme.fontSize.sm, color: theme.colors.danger },
  submitError: { fontSize: theme.fontSize.sm, color: theme.colors.danger, textAlign: "center" },
});