export type AppEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  createdBy: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
};

// Ce que l'utilisateur saisit dans le formulaire.
export type EventInput = Pick<AppEvent, "title" | "description" | "date">;