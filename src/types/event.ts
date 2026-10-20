/** Lieu d'un événement : le nom affiché et ses coordonnées (pour la météo et la distance). */
export type EventLocation = {
  label: string; // ex : "Béthune, FR"
  latitude: number;
  longitude: number;
};

export type AppEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: EventLocation | null; // null = pas de lieu renseigné (champ facultatif)
  createdBy: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
};

// Ce que l'utilisateur saisit dans le formulaire (le lieu arrive déjà géocodé).
export type EventInput = Pick<AppEvent, "title" | "description" | "date" | "location">;
