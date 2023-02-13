import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const findHouseFortuneDateQuery = `query ($communityId: String!) {
  houseUserFortune(where: {communityId: $communityId}){
    id
    lastDate
    communityId
  }
}`;

export const createHouseFortuneDateQuery = `mutation ($communityId: String!, $lastDate: String!) {
  createHouseUserFortune(data: {
    lastDate: $lastDate,
    communityId: $communityId
  }) {
    lastDate
    communityId
  }
}`;

export const updateHouseFortuneDateQuery = `mutation ($communityId: String!, $lastDate: String!) {
  updateHouseUserFortune(where: {communityId: $communityId}, data: {
    lastDate: $lastDate,
    communityId: $communityId
  }) {
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
      query: findHouseFortuneDateQuery,
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

export const updateHouseFortuneDate = async ({
  communityId,
  lastDate,
  adminToken,
  isFirstTime,
}: {
  communityId: string;
  lastDate: string;
  adminToken: string;
  isFirstTime: boolean;
}): Promise<{
  type: "success" | "error";
}> => {
  const [email, password] = adminToken.split(":");
  const cookie = await login({
    email,
    password,
  });

  const { data: userData } = await axios.post(
    endpoint,
    {
      query: isFirstTime
        ? createHouseFortuneDateQuery
        : updateHouseFortuneDateQuery,
      variables: {
        communityId,
        lastDate,
      },
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const updateHouseUserFortune = isFirstTime
    ? userData?.data?.createHouseUserFortune
    : userData?.data?.updateHouseUserFortune;

  console.log({
    updateHouseUserFortune,
  });
  if (updateHouseUserFortune) return { type: "success" };
  return { type: "error" };
};
