import { configureStore } from '@reduxjs/toolkit';
import deckReducer from './deckSlice';
import cardReducer from './cardSlice';
import versionReducer from './versionSlice';

const store = configureStore({
  reducer: {
    decks: deckReducer,
    cards: cardReducer,
    version: versionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
