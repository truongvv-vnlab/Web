import { openDB } from "idb";

export const initDB = async () => {
  return openDB("decks", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("decks")) {
        db.createObjectStore("decks", { keyPath: "uuid" });
      }
      if (!db.objectStoreNames.contains("cards")) {
        db.createObjectStore("cards", { keyPath: "uuid" });
      }
    },
  });
};

export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
