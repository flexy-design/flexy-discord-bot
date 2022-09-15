import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const updateHasWelcomeSentQuery = `mutation ($id: ID!, $hasWelcomeSent: Boolean!, $index: String!) {
  updateCommunityUser(where: {id: $id}, data: {
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

export const updateHasWelcomeSent = async ({
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
      query: updateHasWelcomeSentQuery,
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
  const updatedUser = userData?.data?.updateCommunityUser;

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
