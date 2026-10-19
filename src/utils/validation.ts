export const PASSWORD_MIN_LENGTH = 6;

// Volontairement tolérant : la seule vraie preuve qu'un email existe, c'est d'y envoyer un message.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (email.trim() === "") return "L'email est obligatoire.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Format d'email invalide.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password === "") return "Le mot de passe est obligatoire.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `${PASSWORD_MIN_LENGTH} caractères minimum.`;
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (name.trim() === "") return "Le nom est obligatoire.";
  return undefined;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | undefined {
  if (confirmation !== password) return "Les mots de passe ne correspondent pas.";
  return undefined;
}

/** Vrai si au moins un champ du formulaire a une erreur. */
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined);
}