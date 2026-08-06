
// Pastor's Daily Declaration — stored in Firestore collection `pastor_declarations`

export interface PastorDeclaration {
  id: string;
  text: string;
  imageUrl?: string;       // uploaded image; falls back to DEFAULT_PASTOR_IMAGE if absent
  published: boolean;
  createdAt: string;       // ISO timestamp
  date?: string;           // label like "6/8/2026"
}
