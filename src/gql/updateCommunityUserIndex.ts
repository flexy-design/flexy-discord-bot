import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const updateCommunityUserIndexMutation = `mutation ($index: Int!) {
  updateIndexList(where: {name: "community-user"}, data: {index: $index}) {
      index
  }
}`;

export const updateCommunityUserIndex = async ({
  adminToken,
  index,
}: {
  adminToken: string;
  index: number;
}): Promise<{
  type: "success" | "error";
  data: {
    index: number;
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
      query: updateCommunityUserIndexMutation,
      variables: {
        index,
      },
    },
    {
      headers: {
        cookie,
      },
    }
  );

  if (userData?.data?.updateIndex?.index !== undefined) {
    return {
      type: "success",
      data: {
        index,
      },
    };
  } else {
    return {
      type: "error",
      data: null,
    };
  }
};
