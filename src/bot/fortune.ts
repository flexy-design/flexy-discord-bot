import { Events } from "discord.js";
import { houseCodeClient } from "../discord";
import { env } from "../env";
import { getFortune } from "../gpt";
import {
  findHouseFortuneDate,
  updateHouseFortuneDate,
} from "../gql/findHouseFortuneDate";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export const initializeFortuneBot = async () => {
  houseCodeClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "운세") return;

    const userId = interaction.user.id;

    interaction.reply("운세를 보여줄거에요 관리자님 어서 개발해주세요.");

    const { lastDate } = await findHouseFortuneDate({
      communityId: userId,
      adminToken: env.cmsAdminToken,
    });

    console.log({
      lastDate,
    });

    // get YYYY-MM-DD
    const today = dayjs().format("YYYY-MM-DD");
    console.log({ today });

    if (lastDate === today) {
      interaction.reply("오늘은 이미 운세를 보셨어요.");
      return;
    }

    interaction.reply(await getFortune());

    await updateHouseFortuneDate({
      communityId: userId,
      lastDate: today,
      adminToken: env.cmsAdminToken,
    });
  });
};
