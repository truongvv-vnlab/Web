import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  saveDeckToDB,
  getDecksFromDB,
  deleteDeckFromDB,
  softDeleteDeckInDB,
  incrementVersionInLocalStorage,
} from "./indexedDB";
import { DeckType } from "./type";
import { RootState } from ".";

interface DeckState {
  decks: DeckType[];
}

const initialState: DeckState = {
  decks: [],
};

export const fetchDecks = createAsyncThunk("decks/fetch", async () => {
  return await getDecksFromDB();
});

const deckSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    addDeck: (state, action) => {
      state.decks.push(action.payload);
      saveDeckToDB(action.payload);
    },
    updateDeck: (state, action) => {
      const index = state.decks.findIndex(
        (deck) => deck._id === action.payload._id
      );
      if (index !== -1) {
        const updatedDeck = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        state.decks[index] = updatedDeck;
        saveDeckToDB(action.payload);
      }
    },
    deleteDeck: (state, action) => {
      state.decks = state.decks.filter((deck) => deck._id !== action.payload);
      deleteDeckFromDB(action.payload);
    },
    deleteSoftDeck: (state, action) => {
      const index = state.decks.findIndex(
        (deck) => deck._id === action.payload
      );

      if (index !== -1) {
        const updatedDeck = {
          ...state.decks[index],
          version: incrementVersionInLocalStorage(),
          isDelete: true,
          updatedAt: new Date().toISOString(),
        };
        state.decks[index] = updatedDeck;
        saveDeckToDB(updatedDeck);
        softDeleteDeckInDB(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDecks.fulfilled, (state, action) => {
      state.decks = action.payload;
    });
  },
});

export const selectAllDecks = createSelector(
  (state: RootState) => state.decks.decks,
  (decks) => decks
);

export const selectActiveDecks = createSelector(
  (state: RootState) => state.decks.decks,
  (decks) => decks.filter((deck) => !deck.isDelete)
);

export const selectDeckById = (deckId: string) =>
  createSelector([(state: RootState) => state.decks.decks], (decks) =>
    decks.find((deck) => deck._id === deckId)
  );

export const { addDeck, updateDeck, deleteDeck, deleteSoftDeck } =
  deckSlice.actions;
export default deckSlice.reducer;
