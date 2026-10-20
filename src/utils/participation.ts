import type { AppEvent } from "@/types/event";

/** Vrai si l'utilisateur fait partie des participants. userId absent (déconnecté) : toujours faux. */
export function isUserParticipating(event: Pick<AppEvent, "participantIds">, userId: string | undefined): boolean {
  return userId !== undefined && event.participantIds.includes(userId);
}

/** "0 participant", "1 participant", "2 participants" : zéro s'accorde au singulier en français. */
export function formatParticipantCount(count: number): string {
  return `${count} participant${count > 1 ? "s" : ""}`;
}
