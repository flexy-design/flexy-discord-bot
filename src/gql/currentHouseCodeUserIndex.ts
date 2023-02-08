import axios from "axios";
import { endpoint } from "./constant";
import { login } from "./login";

export const currentHouseCodeUserIndexQuery = `query {
  indexList(where: {name: "housecode-user"}) {
    index
  }
}`;

export const currentHouseCodeUserIndex = async ({
  adminToken,
}: {
  adminToken: string;
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
      query: currentHouseCodeUserIndexQuery,
    },
    {
      headers: {
        cookie,
      },
    }
  );
  const index = userData?.data?.indexList?.index;

  if (typeof index !== undefined) {
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
