import {
  Client,
  Collection,
  GatewayIntentBits,
  SlashCommandBuilder,
} from "discord.js";

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

houseCodeCommands.set("운세", {
  data: new SlashCommandBuilder()
    .setName("운세")
    .setDescription("하루 한 번 내 운세를 봅니다."),
  async execute(interaction) {
    await interaction.reply("운세를 봅니다.");
  },
});
