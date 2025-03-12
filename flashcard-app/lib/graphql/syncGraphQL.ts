import { gql } from "@apollo/client";

export const SYNC_MUTATION = gql`
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
      deleteLogs {
        type
        targetId
        version
      }
    }
  }
`;
