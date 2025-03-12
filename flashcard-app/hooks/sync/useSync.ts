import { SYNC_MUTATION } from "@/lib/graphql/syncGraphQL";
import {
  deleteCardFromDB,
  deleteDeckFromDB,
  getCardsByVersionFromDB,
  getDecksByVersionFromDB,
  getVersionFromLocalStorage,
  hardDeletedItemsFromDB,
  saveCardToDB,
  saveDeckToDB,
  updateVersionInLocalStorage,
} from "@/store/indexedDB";
import { useCallback, useState } from "react";
import apolloClient from "@/lib/apolloClient";
import { useDispatch } from "react-redux";
import { fetchDecks } from "@/store/deckSlice";
import { fetchCards } from "@/store/cardSlice";
import { AppDispatch } from "@/store";
import { DeleteType } from "@/lib/enum/deleteType";

export const useSyncData = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  const syncData = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      let versionData = getVersionFromLocalStorage();
      let decks = [];
      let cards = [];
      if (versionData) {
        decks = await getDecksByVersionFromDB(versionData + 1);
        console.log(decks);
        cards = await getCardsByVersionFromDB(versionData + 1);
        if (decks.length > 0 || cards.length > 0) {
          versionData++;
        }
      }

      const { data } = await apolloClient.mutate({
        mutation: SYNC_MUTATION,
        variables: {
          input: {
            version: versionData ?? 0,
            decks,
            cards,
          },
        },
      });

      await hardDeletedItemsFromDB();
      const {
        version,
        decks: newDecks,
        cards: newCards,
        deleteLogs,
      } = data.sync;

      updateVersionInLocalStorage(version);

      for (const deck of newDecks) {
        await saveDeckToDB({ ...deck, isDelete: false });
      }

      for (const card of newCards) {
        await saveCardToDB({ ...card, isDelete: false });
      }
      if (deleteLogs.length > 0) {
        for (const log of deleteLogs) {
          if (log.type === DeleteType.DECK) {
            await deleteDeckFromDB(log.targetId);
          } else if (log.type === DeleteType.CARD) {
            await deleteCardFromDB(log.targetId);
          }
        }
      }
      dispatch(fetchDecks());
      dispatch(fetchCards());
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { syncData, isSyncing, error };
};
