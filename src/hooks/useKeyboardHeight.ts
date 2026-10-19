import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

/**
 * Hauteur actuelle du clavier en points (0 quand il est fermé).
 * Remplace KeyboardAvoidingView, qui ne fonctionne plus sur Android en edge-to-edge.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // On s'abonne aux événements du clavier au montage de l'écran.
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setHeight(0);
    });

    // Nettoyage au démontage : sans lui, les écouteurs s'accumuleraient.
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return height;
}