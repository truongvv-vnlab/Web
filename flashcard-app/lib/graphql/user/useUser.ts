import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    whoami {
      _id
      name
      email
      username
      googleId
    }
  }
`;

export const UPDATE_NAME = gql`
  mutation UpdateName($name: String!) {
    updateName(name: $name) {
      _id
      name
      email
      username
      googleId
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;
