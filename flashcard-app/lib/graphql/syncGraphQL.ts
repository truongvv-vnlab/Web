import { gql } from "@apollo/client";
import { CardType, DeckType } from "@/store/type";
import {
  getCardsByVersionFromDB,
  getDecksByVersionFromDB,
  getVersionFromDB,
  hardDeletedItemsFromDB,
  saveCardToDB,
  saveDeckToDB,
  updateVersionInDB,
} from "@/store/indexedDB";
import apolloClient from "../apolloClient";

const SYNC_MUTATION = gql`
  mutation sync($input: SyncInput!) {
    sync(input: $input) {
      version
      decks {
        _id
        name
        description
        version
        createdAt
        updatedAt
      }
      cards {
        _id
        deckId
        front
        back
        starred
        version
        createdAt
        updatedAt
      }
    }
  }
`;

export const syncData = async () => {
  try {
    const versionData: number | null = await getVersionFromDB();
    let decks: DeckType[] = [];
    let cards: CardType[] = [];
    if (versionData) {
      decks = await getDecksByVersionFromDB(versionData);
      cards = await getCardsByVersionFromDB(versionData);
    }
    const { data } = await apolloClient.mutate({
      mutation: SYNC_MUTATION,
      variables: {
        input: {
          version: versionData ? versionData : 0,
          decks,
          cards,
        },
      },
    });
    await hardDeletedItemsFromDB();
    const { version, decks: newDecks, cards: newCards } = data.sync;
    await updateVersionInDB(version);

    for (const deck of newDecks) {
      await saveDeckToDB({ ...deck, isDelete: false });
    }

    for (const card of newCards) {
      await saveCardToDB({ ...card, isDelete: false });
    }
  } catch (error) {}
};
