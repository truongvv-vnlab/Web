export type DeckType = {
  _id: string;
  name: string;
  description?: string;
  isDelete: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type CardType = {
  _id: string;
  front: string;
  back: string;
  deckId: string;
  starred: boolean;
  isDelete: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type VersionType = {
  version: number | null;
};
