// src/app/index.tsx
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EventEase</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // occupe tout l'écran disponible
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.primary,
  },
});