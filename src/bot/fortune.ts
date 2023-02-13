import { Events } from "discord.js";
import { houseCodeClient } from "../discord";
import { env } from "../env";
import { findHouseFortuneDate } from "../gql/findHouseFortuneDate";

export const initializeFortuneBot = async () => {
  houseCodeClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    // if (!interaction.isCommand()) return;
    if (interaction.commandName !== "운세") return;

    const userId = interaction.user.id;

    interaction.reply("운세를 보여줄거에요 관리자님 어서 개발해주세요.");

    const lastFoundedDate = await findHouseFortuneDate({
      communityId: userId,
      adminToken: env.cmsAdminToken,
    });

    console.log({
      lastFoundedDate,
    });
  });
};
