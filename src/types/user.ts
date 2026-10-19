export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

// Ce qu'on garde en mémoire pour l'utilisateur connecté.
// Le hash n'a rien à faire dans l'état de l'app : on le retire.
export type PublicUser = Omit<User, "passwordHash">;