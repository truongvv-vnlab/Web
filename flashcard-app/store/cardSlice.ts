import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {
  saveCardToDB,
  getCardsFromDB,
  deleteCardFromDB,
  incrementVersionInLocalStorage,
} from './indexedDB';
import { CardType } from './type';
import { RootState } from '.';

interface CardState {
  cards: CardType[];
}

const initialState: CardState = {
  cards: [],
};

export const fetchCards = createAsyncThunk('cards/fetch', async () => {
  return await getCardsFromDB();
});

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addCard: (state, action) => {
      state.cards.push(action.payload);
      saveCardToDB(action.payload);
    },
    updateCard: (state, action) => {
      const index = state.cards.findIndex(
        (card) => card._id === action.payload._id
      );
      if (index !== -1) {
        const updatedCard: CardType = {
          ...action.payload,
          version: incrementVersionInLocalStorage(),
          updatedAt: new Date().toISOString(),
        };
        state.cards[index] = updatedCard;
        saveCardToDB(updatedCard);
      }
    },
    deleteCard: (state, action) => {
      state.cards = state.cards.filter((card) => card._id !== action.payload);
      deleteCardFromDB(action.payload);
    },
    deleteSoftCard: (state, action) => {
      const index = state.cards.findIndex(
        (card) => card._id === action.payload
      );
      if (index !== -1) {
        const updatedCard = {
          ...state.cards[index],
          isDelete: true,
          version: incrementVersionInLocalStorage(),
          updatedAt: new Date().toISOString(),
        };
        state.cards[index] = updatedCard;
        saveCardToDB(updatedCard);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCards.fulfilled, (state, action) => {
      state.cards = action.payload;
    });
  },
});

export const selectActiveCards = createSelector(
  (state: RootState) => state.cards.cards,
  (cards) => cards.filter((card) => !card.isDelete)
);

export const selectAllCards = createSelector(
  (state: RootState) => state.cards.cards,
  (cards) => cards
);

export const selectAllActiveCardsByDeckId = (deckId: string) =>
  createSelector(
    (state: RootState) => state.cards.cards,
    (cards) => cards.filter((card) => !card.isDelete && card.deckId === deckId)
  );

export const selectActiveStarredCards = createSelector(
  (state: RootState) => state.cards.cards,
  (cards) => cards.filter((card) => card.starred && !card.isDelete)
);

export const { addCard, updateCard, deleteCard, deleteSoftCard } =
  cardSlice.actions;
export default cardSlice.reducer;
