import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const findHouseHasntSentWelcomeQuery = `query ($communityId: String!) {
  houseUserFortune(where: {communityId: $communityId) {
    id
    lastDate
    communityId
  }
}`;

export const findHouseFortuneDate = async ({
  communityId,
  adminToken,
}: {
  communityId: string;
  adminToken: string;
}): Promise<{
  type: "success" | "new";
  lastDate?: string | null;
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
      variables: {
        communityId,
      },
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const foundedUserCommunityId = userData?.data?.communityUser?.communityId;
  const foundedLastDate = userData?.data?.communityUser?.lastDate;

  if (foundedUserCommunityId === communityId)
    return { type: "success", lastDate: foundedLastDate };

  return { type: "new" };
};
