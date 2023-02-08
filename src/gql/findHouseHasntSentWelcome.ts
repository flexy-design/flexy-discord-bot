import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const findHouseHasntSentWelcomeQuery = `query {
  houseUsers(where: { hasWelcomeSent: {
    equals: false
  }},  take:1) {
    id
    communityId
    hasWelcomeSent
    name
    profileUrl
  }
}`;

export const findHouseHasntSentWelcome = async ({
  adminToken,
}: {
  adminToken: string;
}): Promise<{
  type: "success" | "error";
  data: {
    id: string;
    communityId: string;
    hasWelcomeSent: boolean;
    name: string;
    profileUrl: string;
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
      query: findHouseHasntSentWelcomeQuery,
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const foundedUser = userData?.data?.houseUsers?.[0];

  if (foundedUser) {
    return {
      type: "success",
      data: foundedUser,
    };
  } else {
    return {
      type: "error",
      data: null,
    };
  }
};
