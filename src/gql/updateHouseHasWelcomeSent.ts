import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const updateHouseHasWelcomeSentQuery = `mutation ($id: ID!, $hasWelcomeSent: Boolean!, $index: String!) {
  updateHouseUser(where: {id: $id}, data: {
    hasWelcomeSent: $hasWelcomeSent,
    index: $index
  }) {
    id
    communityId
    hasWelcomeSent
    name,
    index
  }
}`;

export const updateHouseHasWelcomeSent = async ({
  id,
  hasWelcomeSent,
  adminToken,
  index,
}: {
  id: string;
  hasWelcomeSent: boolean;
  adminToken: string;
  index: string;
}): Promise<{
  type: "success" | "error";
  data: {
    id: string;
    communityId: string;
    hasWelcomeSent: boolean;
    name: string;
  } | null;
}> => {
  const [email, password] = adminToken.split(":");
  const cookie = await login({
    email,
    password,
  });

  const { data: userData } = await axios.post(
    endpoint,
    {
      query: updateHouseHasWelcomeSentQuery,
      variables: {
        id,
        hasWelcomeSent,
        index,
      },
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const updatedUser = userData?.data?.updateHouseUser;

  if (updatedUser) {
    return {
      type: "success",
      data: updatedUser,
    };
  } else {
    return {
      type: "error",
      data: null,
    };
  }
};
