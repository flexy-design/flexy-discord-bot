import dotenv from "dotenv";
dotenv.config();

export const env = {
  botName: process.env.BOT_NAME || "Community Bot",
  redisUrl: process.env.REDIS_URL || "",
  memeWebHookUrl: process.env.MEME_WEBHOOK_URL || "",
  welcomeWebHookUrl: process.env.WELCOME_WEBHOOK_URL || "",
  discordBotToken: process.env.DISCORD_BOT_TOKEN || "",
};
