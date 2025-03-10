import { CardType, DeckType, VersionType } from "@/store/type";
import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";

const DB_NAME = "DB";
const DB_VERSION = 1;
const STORE_DECKS = "decks";
const STORE_CARDS = "cards";
const STORE_VERSION = "version";

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_DECKS)) {
        db.createObjectStore(STORE_DECKS, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(STORE_CARDS)) {
        db.createObjectStore(STORE_CARDS, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(STORE_VERSION)) {
        const store = db.createObjectStore(STORE_VERSION, { keyPath: "id" });
        store.put({ id: "current", version: 0 });
      }
    },
  });
};

export const generateUUID = (): string => uuidv4();

export const saveDeckToDB = async (deck: DeckType) => {
  const db = await initDB();
  if (!deck._id) {
    deck._id = generateUUID();
  }
  return db.put(STORE_DECKS, deck);
};

export const getDecksFromDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_DECKS);
};

export const deleteDeckFromDB = async (_id: string) => {
  const db = await initDB();
  const allCards = await db.getAll(STORE_CARDS);
  const cardsToDelete = allCards.filter((card) => card.deckId === _id);
  for (const card of cardsToDelete) {
    await db.delete(STORE_CARDS, card._id);
  }
  return db.delete(STORE_DECKS, _id);
};

export const softDeleteDeckInDB = async (_id: string) => {
  const db = await initDB();

  const allCards = await db.getAll(STORE_CARDS);
  const cardsToUpdate = allCards.filter((card) => card.deckId === _id);

  for (const card of cardsToUpdate) {
    const updatedCard = {
      ...card,
      isDelete: true,
      updatedAt: new Date().toISOString(),
    };
    await db.put(STORE_CARDS, updatedCard);
  }

  return true;
};

export const getDecksByVersionFromDB = async (version: number) => {
  const db = await initDB();
  const allDecks = await db.getAll(STORE_DECKS);
  return allDecks.filter((deck) => deck.version === version);
};

export const saveCardToDB = async (card: CardType) => {
  const db = await initDB();
  if (!card._id) {
    card._id = generateUUID();
  }
  return db.put(STORE_CARDS, card);
};

export const getCardsFromDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_CARDS);
};

export const deleteCardFromDB = async (_id: string) => {
  const db = await initDB();
  return db.delete(STORE_CARDS, _id);
};

export const getCardsByVersionFromDB = async (version: number) => {
  const db = await initDB();
  const allCards = await db.getAll(STORE_CARDS);
  return allCards.filter((card) => card.version === version);
};

export const saveVersionToDB = async (version: VersionType) => {
  const db = await initDB();
  return db.put(STORE_VERSION, version);
};

export const getVersionFromDB = async (): Promise<number | null> => {
  const db = await initDB();
  const versionData = await db.get(STORE_VERSION, "current");
  return versionData ? versionData.version : null;
};

export const updateVersionInDB = async (newVersion: number) => {
  const db = await initDB();
  return db.put(STORE_VERSION, { id: "current", version: newVersion });
};

export const hardDeletedItemsFromDB = async () => {
  const db = await initDB();

  const allDecks = await db.getAll(STORE_DECKS);
  const decksToDelete = allDecks.filter((deck) => deck.isDelete);
  for (const deck of decksToDelete) {
    await db.delete(STORE_DECKS, deck._id);
  }

  const allCards = await db.getAll(STORE_CARDS);
  const cardsToDelete = allCards.filter((card) => card.isDelete);
  for (const card of cardsToDelete) {
    await db.delete(STORE_CARDS, card._id);
  }

  return true;
};

export const clearDB = async () => {
  const db = await initDB();
  await db.clear(STORE_DECKS);
  await db.clear(STORE_CARDS);
  await db.clear(STORE_VERSION);
};
