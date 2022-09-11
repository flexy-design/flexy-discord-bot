import dotenv from "dotenv";
dotenv.config();

export const env = {
  botName: process.env.BOT_NAME || "Community Bot",
  redisUrl: process.env.REDIS_URL || "",
  memeWebHookUrl: process.env.MEME_WEBHOOK_URL || "",
};
