import { CardType, DeckType, VersionType } from '@/store/type';
import { openDB } from 'idb';

const DB_NAME = 'DB';
const DB_VERSION = 1;
const STORE_DECKS = 'decks';
const STORE_CARDS = 'cards';
const STORE_VERSION = 'version';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_DECKS)) {
        db.createObjectStore(STORE_DECKS, { keyPath: 'uuid' });
      }
      if (!db.objectStoreNames.contains(STORE_CARDS)) {
        db.createObjectStore(STORE_CARDS, { keyPath: 'uuid' });
      }
      if (!db.objectStoreNames.contains(STORE_VERSION)) {
        db.createObjectStore(STORE_VERSION, { keyPath: 'version' });
      }
    },
  });
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const saveDeckToDB = async (deck: DeckType) => {
  const db = await initDB();
  await db.put(STORE_DECKS, deck);
};

export const getDecksFromDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_DECKS);
};

export const deleteDeckFromDB = async (uuid: string) => {
  const db = await initDB();
  await db.delete(STORE_DECKS, uuid);
};

export const saveCardToDB = async (card: CardType) => {
  const db = await initDB();
  await db.put(STORE_CARDS, card);
};

export const getCardsFromDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_CARDS);
};

export const deleteCardFromDB = async (uuid: string) => {
  const db = await initDB();
  await db.delete(STORE_CARDS, uuid);
};

export const saveVersionToDB = async (version: VersionType) => {
  const db = await initDB();
  await db.put(STORE_VERSION, version);
};

export const getVersionFromDB = async () => {
  const db = await initDB();
  return db.get(STORE_VERSION, 'version');
};
