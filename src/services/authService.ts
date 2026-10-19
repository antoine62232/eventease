import * as Crypto from "expo-crypto";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { PublicUser, RegisterInput, User } from "@/types/user";
import { generateId } from "@/utils/id";
import { readJson, removeItem, writeJson } from "./storage";

const INVALID_CREDENTIALS = "Email ou mot de passe incorrect.";

/** Empreinte SHA-256 du sel concaténé au mot de passe. */
function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + password);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Construit la version publique : on liste explicitement les champs gardés. */
function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

/** Crée un compte, ouvre la session et renvoie l'utilisateur connecté. */
export async function register(input: RegisterInput): Promise<PublicUser> {
  const users = await readJson<User[]>(STORAGE_KEYS.users, []);
  const email = normalizeEmail(input.email);

  if (users.some((user) => user.email === email)) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const salt = generateId(); // un UUID aléatoire fait un bon sel
  const newUser: User = {
    id: generateId(),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };

  // Nouveau tableau plutôt que users.push : on ne modifie jamais une donnée lue.
  await writeJson(STORAGE_KEYS.users, [...users, newUser]);

  const publicUser = toPublicUser(newUser);
  await writeJson(STORAGE_KEYS.session, publicUser);
  return publicUser;
}

/** Vérifie les identifiants, ouvre la session et renvoie l'utilisateur connecté. */
export async function login(email: string, password: string): Promise<PublicUser> {
  const users = await readJson<User[]>(STORAGE_KEYS.users, []);
  const user = users.find((u) => u.email === normalizeEmail(email));

  if (user === undefined) {
    throw new Error(INVALID_CREDENTIALS);
  }

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    throw new Error(INVALID_CREDENTIALS);
  }

  const publicUser = toPublicUser(user);
  await writeJson(STORAGE_KEYS.session, publicUser);
  return publicUser;
}

/** Utilisateur de la session en cours, ou null si personne n'est connecté. */
export function getSession(): Promise<PublicUser | null> {
  return readJson<PublicUser | null>(STORAGE_KEYS.session, null);
}

/** Ferme la session. Les comptes inscrits restent stockés. */
export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.session);
}