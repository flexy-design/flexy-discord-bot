import { Client, GatewayIntentBits } from "discord.js";

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
