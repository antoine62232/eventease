import { isPastEvent, isValidIsoDate } from "./dates";

// Fonctions pures : elles renvoient un message d'erreur, ou undefined si le champ est valide.

export const PASSWORD_MIN_LENGTH = 6;

// Format simple : quelque chose, un @, quelque chose, un point, quelque chose, sans espaces.
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

// Événements

export const EVENT_TITLE_MAX_LENGTH = 80;
export const EVENT_DESCRIPTION_MAX_LENGTH = 500;

export function validateEventTitle(title: string): string | undefined {
  if (title.trim() === "") return "Le titre est obligatoire.";
  if (title.trim().length > EVENT_TITLE_MAX_LENGTH) {
    return `${EVENT_TITLE_MAX_LENGTH} caractères maximum.`;
  }
  return undefined;
}

/** La description est facultative, mais limitée en longueur. */
export function validateEventDescription(description: string): string | undefined {
  if (description.trim().length > EVENT_DESCRIPTION_MAX_LENGTH) {
    return `${EVENT_DESCRIPTION_MAX_LENGTH} caractères maximum.`;
  }
  return undefined;
}

/** Utilisée à la création uniquement : un nouvel événement ne peut pas être dans le passé. */
export function validateFutureDate(isoDate: string, now: Date = new Date()): string | undefined {
  if (!isValidIsoDate(isoDate)) return "Date invalide.";
  if (isPastEvent(isoDate, now)) return "La date doit être dans le futur.";
  return undefined;
}

export const EVENT_LOCATION_MAX_LENGTH = 100;
