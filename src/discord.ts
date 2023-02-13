import { Client, Collection, GatewayIntentBits } from "discord.js";

export const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites],
});

export const houseCodeClient = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export const houseCodeCommands = new Collection();
(client as any).commands = houseCodeCommands;

houseCodeCommands.set("fortune", {
  name: "fortune",
  description: "하루 한 번 내 운세를 볼 수 있습니다.",
  execute: async (interaction: any) => {
    await interaction.reply(
      `죄송합니다. ${interaction.user.username}님의 운세는 아직 구현되지 않았습니다.`
    );
  },
});
