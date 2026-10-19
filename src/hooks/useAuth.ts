import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/context/AuthContext";

/** Accès à l'utilisateur connecté et aux actions d'authentification. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  // Erreur explicite si un composant est utilisé hors du Provider,
  // au lieu d'un "cannot read property of null" incompréhensible plus loin.
  if (context === null) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }

  return context;
}