import axios from "axios";
import { endpoint } from "./constant";

export const loginQuery = `mutation ($email: String!, $password: String!) {
  authenticateUserWithPassword(
    email: $email,
    password: $password
  ) {
    ... on UserAuthenticationWithPasswordSuccess {
      item {
        id
        email
      }
    }
    ... on UserAuthenticationWithPasswordFailure {
      message
    }
  }
}`;

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // gql variables
  const { data, headers } = await axios.post(endpoint, {
    query: loginQuery,
    variables: {
      email,
      password,
    },
  });

  const match = data?.data?.authenticateUserWithPassword?.item?.email as
    | string
    | undefined;

  const cookie = headers?.["set-cookie"]?.[0];

  if (match === email && cookie) return cookie;
  return null;
};
