import axios from "axios";

export const endpoint = "https://cms.flexy.design/api/graphql";

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

export const findHasntSentWelcomeQuery = `query {
  communityUsers(where: { hasWelcomeSent: {
    equals: false
  }},  take:1) {
    id
    communityId
    hasWelcomeSent
    name
    profileUrl
  }
}`;

export const updateHasWelcomeSentQuery = `mutation ($id: ID!, $hasWelcomeSent: Boolean!) {
  updateCommunityUser(where: {id: $id}, data: {
    hasWelcomeSent: $hasWelcomeSent
  }) {
    id
    communityId
    hasWelcomeSent
    name
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

export const findHasntSentWelcome = async ({
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
      query: findHasntSentWelcomeQuery,
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const foundedUser = userData?.data?.communityUsers?.[0];

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

export const updateHasWelcomeSent = async ({
  id,
  hasWelcomeSent,
  adminToken,
}: {
  id: string;
  hasWelcomeSent: boolean;
  adminToken: string;
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
