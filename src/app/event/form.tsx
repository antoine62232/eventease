// src/app/event/form.tsx
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function EventFormScreen() {
  // id est optionnel : absent = création, présent = modification.
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = id !== undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditMode ? `Modification de l'événement ${id}` : "Nouvel événement"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  title: { fontSize: theme.fontSize.lg, fontWeight: "700", color: theme.colors.text },
});