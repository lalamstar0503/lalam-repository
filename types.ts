export interface Character {
  id: string;
  name: string;
  thumbnail: string | null; // Base64 string
  infoText: string; // Basic stats (Age, Height, etc.)
  description: string; // Long bio
  gallery: string[]; // Array of Base64 strings
  createdAt: number;
  updatedAt: number;
}

export type ViewState = 
  | { type: 'LIST' }
  | { type: 'VIEW'; id: string }
  | { type: 'EDIT'; id: string }
  | { type: 'CREATE' };
