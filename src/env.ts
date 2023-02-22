import dotenv from "dotenv";
dotenv.config();

export const env = {
  botName: process.env.BOT_NAME || "Community Bot",
  redisUrl: process.env.REDIS_URL || "",
  memeWebHookUrl: process.env.MEME_WEBHOOK_URL || "",
  welcomeWebHookUrl: process.env.WELCOME_WEBHOOK_URL || "",
  welcomeHouseWebHookUrl: process.env.WELCOME_HOUSE_WEBHOOK_URL || "",
  discordBotToken: process.env.DISCORD_BOT_TOKEN || "",
  houseCodeBotToken: process.env.HOUSE_CODE_BOT_TOKEN || "",
  introducesChannelId: process.env.INTRODUCES_CHANNEL_ID || "",
  cmsAdminToken: process.env.CMS_ADMIN_TOKEN || "",
  accountIdOfS3: process.env.AWS_S3_ACCOUNT_ID || "",
  accessKeyIdOfS3: process.env.AWS_S3_ACCESS_KEY || "",
  secretAccessKeyOfS3: process.env.AWS_S3_SECRET_KEY || "",
  openAIKey: process.env.OPEN_AI_KEY || "",
  supabaseServiceUrl: process.env.SUPABASE_SERVICE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || "",
};
