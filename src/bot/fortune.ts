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

    const { lastDate } = await findHouseFortuneDate({
      communityId: userId,
      adminToken: env.cmsAdminToken,
    });

    console.log({
      lastDate,
    });

    const isFirstTime = lastDate === undefined;

    await interaction.deferReply();
    await interaction.editReply({
      content: "운세를 보고있는 중입니다...",
    });

    const today = dayjs().format("YYYY-MM-DD");

    if (lastDate === today) {
      interaction.editReply(
        "오늘은 이미 운세를 보셨어요. 내일 다시 시도해주세요!"
      );
      return;
    }

    await updateHouseFortuneDate({
      communityId: userId,
      lastDate: today,
      adminToken: env.cmsAdminToken,
      isFirstTime,
    });

    await interaction.editReply({
      content: `<@${interaction.user.id}> ${await getFortune()}`,
    });
  });
};
