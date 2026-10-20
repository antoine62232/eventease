/**
 * Message à afficher pour une erreur attrapée dans un catch.
 * En TypeScript, error est de type unknown : rien ne garantit que ce soit une Error avec un message.
 */
export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue."): string {
  return error instanceof Error ? error.message : fallback;
}
