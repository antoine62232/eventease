// src/components/events/EventForm.tsx
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import type { EventInput } from "@/types/event";
import { formatDay, formatTime, withDatePart, withTimePart } from "@/utils/dates";
import {
  EVENT_DESCRIPTION_MAX_LENGTH,
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
};

type PickerMode = "date" | "time";

export function EventForm({ initialValues, submitLabel, allowPastDate, onSubmit }: EventFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  // Le sélecteur travaille avec un objet Date : on convertit l'ISO une fois, au départ.
  const [date, setDate] = useState(() => new Date(initialValues.date));
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null); // null = sélecteur fermé
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickerChange = (event: DateTimePickerEvent, picked?: Date) => {
    const mode = pickerMode;
    setPickerMode(null); // Android : le dialogue se ferme après chaque choix, on démonte le composant
    // "dismissed" = l'utilisateur a annulé : on ne change rien.
    if (event.type !== "set" || picked === undefined || mode === null) return;
    // On ne remplace que la partie choisie : le jour OU l'heure.
    setDate((current) => (mode === "date" ? withDatePart(current, picked) : withTimePart(current, picked)));
  };

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

    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, date: isoDate });
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
            onChange={handlePickerChange}
          />
        )}

        {submitError !== null && <Text style={styles.submitError}>{submitError}</Text>}

        <Button title={submitLabel} onPress={handleSubmit} loading={isSubmitting} />
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