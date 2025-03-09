import { CardType, DeckType, VersionType } from '@/store/type';
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'DB';
const DB_VERSION = 1;
const STORE_DECKS = 'decks';
const STORE_CARDS = 'cards';
const STORE_VERSION = 'version';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_DECKS)) {
        db.createObjectStore(STORE_DECKS, { keyPath: '_id' }); // Đổi 'uuid' thành '_id'
      }
      if (!db.objectStoreNames.contains(STORE_CARDS)) {
        db.createObjectStore(STORE_CARDS, { keyPath: '_id' }); // Đổi 'uuid' thành '_id'
      }
      if (!db.objectStoreNames.contains(STORE_VERSION)) {
        db.createObjectStore(STORE_VERSION, { keyPath: 'version' });
      }
    },
  });
};

export const generateUUID = (): string => uuidv4();

// 🚀 Sửa lỗi keyPath không khớp
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

export const saveVersionToDB = async (version: VersionType) => {
  const db = await initDB();
  return db.put(STORE_VERSION, version);
};

export const getVersionFromDB = async () => {
  const db = await initDB();
  const versions = await db.getAll(STORE_VERSION);
  return versions.length ? versions[0] : null;
};

export const updateVersionInDB = async (newVersion: number) => {
  const db = await initDB();
  const currentVersion = await getVersionFromDB();

  if (currentVersion) {
    return db.put(STORE_VERSION, { version: newVersion });
  } else {
    return db.add(STORE_VERSION, { version: newVersion });
  }
};
