import { createContext, type ReactNode, useEffect, useState } from "react";
import * as authService from "@/services/authService";
import type { PublicUser, RegisterInput } from "@/types/user";

export type AuthContextValue = {
  user: PublicUser | null; // null = personne n'est connecté
  isLoading: boolean; // true tant que la session n'a pas été lue au démarrage
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
};

// null par défaut : permet de détecter un oubli du Provider (voir useAuth).
export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage : restaurer la session enregistrée, une seule fois ([] en dépendances).
  useEffect(() => {
    authService
      .getSession()
      .then(setUser)
      .catch(() => setUser(null)) // stockage illisible : on considère l'utilisateur déconnecté
      .finally(() => setIsLoading(false));
  }, []);

  // Chaque action appelle le service (stockage) PUIS met à jour le state (affichage).
  // Si le service lance une erreur, setUser n'est pas atteint et l'erreur remonte à l'écran.
  const signIn = async (email: string, password: string) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
  };

  const signUp = async (input: RegisterInput) => {
    const newUser = await authService.register(input);
    setUser(newUser);
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}