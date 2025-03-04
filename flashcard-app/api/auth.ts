import graphqlClient from "@/lib/graphQLClient";
import { gql } from "graphql-request";

// GraphQL mutation/query
const GOOGLE_LOGIN_QUERY = gql`
  query GoogleLogin {
    googleLogin
  }
`;

// Hàm gọi API đăng nhập
export const googleLogin = async () => {
  const data = await graphqlClient.request(GOOGLE_LOGIN_QUERY);
  return data.googleLogin;
};
