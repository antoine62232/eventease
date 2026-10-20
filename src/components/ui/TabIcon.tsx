import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ColorValue } from "react-native";

type TabIconProps = {
  name: SymbolViewProps["name"]; // { ios: nom SF Symbol, android: nom Material Symbol }
  color: ColorValue; // fourni par la barre d'onglets : bleu si actif, gris sinon
  size: number;
};

/** Icône d'onglet native : SF Symbols sur iOS, Material Symbols sur Android. */
export function TabIcon({ name, color, size }: TabIconProps) {
  return <SymbolView name={name} tintColor={color} size={size} />;
}