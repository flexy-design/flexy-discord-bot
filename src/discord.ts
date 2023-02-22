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

const fortuneCommand = new SlashCommandBuilder()
  .setName("운세")
  .setDescription("하루 한 번 내 운세를 봅니다.");

houseCodeCommands.set("운세", {
  data: fortuneCommand,
});

const createAPICommand = new SlashCommandBuilder()
  .setName("api코드-발급")
  .setDescription("npx housecode 에서 사용할 API코드를 발급합니다.");

houseCodeCommands.set("api코드-발급", {
  data: createAPICommand,
});

// enable command
houseCodeClient.on("ready", async () => {
  console.log("The client is ready!");
  await houseCodeClient.application?.commands.create(fortuneCommand);
  await houseCodeClient.application?.commands.create(createAPICommand);
});
