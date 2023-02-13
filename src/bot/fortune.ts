import { Events } from "discord.js";
import { houseCodeClient } from "../discord";

export const initializeFortuneBot = async () => {
  houseCodeClient.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    // if (!interaction.isCommand()) return;
    if (interaction.commandName !== "운세") return;
    interaction.reply("운세를 보여줄거에요 관리자님 어서 개발해주세요.");
  });
};
