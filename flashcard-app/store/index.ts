import { configureStore } from "@reduxjs/toolkit";
import deckReducer from "./deckSlice";
import cardReducer from "./cardSlice";

const store = configureStore({
  reducer: {
    decks: deckReducer,
    cards: cardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
