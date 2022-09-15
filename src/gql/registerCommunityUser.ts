import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const findUserQuery = `query ($communityId: String!) {
  communityUser(where: {communityId: $communityId}){
    communityId
  }
}`;

export const registerCommunityUserQuery = `mutation ($communityId: String!, $name: String!, $hasWelcomeSent: Boolean!, $profileUrl: String!) {
  createCommunityUser(data: {
    communityId: $communityId,
    name: $name,
    hasWelcomeSent: $hasWelcomeSent
    profileUrl: $profileUrl
  }) {
    communityId
  }
}`;

export const registerCommunityUser = async ({
  name,
  communityId,
  adminToken,
  profileUrl,
}: {
  name: string;
  communityId: string;
  adminToken: string;
  profileUrl: string;
}): Promise<{
  type: "success" | "alreadyRegistered" | "error";
}> => {
  const [email, password] = adminToken.split(":");
  const cookie = await login({
    email,
    password,
  });

  const { data: userData } = await axios.post(
    endpoint,
    {
      query: findUserQuery,
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

  if (foundedUserCommunityId === communityId)
    return { type: "alreadyRegistered" };

  const { data: registerData } = await axios.post(
    endpoint,
    {
      query: registerCommunityUserQuery,
      variables: {
        communityId,
        name,
        hasWelcomeSent: false,
        profileUrl,
      },
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const registeredUserCommunityId =
    registerData?.data?.createCommunityUser?.communityId;

  if (registeredUserCommunityId === communityId) {
    return {
      type: "success",
    };
  } else {
    return {
      type: "error",
    };
  }
};
