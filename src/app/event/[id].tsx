// src/app/event/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function EventDetailScreen() {
  // Le nom entre crochets dans le fichier ([id]) devient le nom du paramètre.
  // Le générique <{ id: string }> sert au typage : la valeur reste une string.
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de l'événement {id}</Text>
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