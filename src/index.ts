import chalk from "chalk";
import { initializeMemeBot } from "./bot/meme";
import { initializeWelcomeBot } from "./bot/welcome";
import { client } from "./discord";
import { env } from "./env";
import { redisClient } from "./redis";

void (async () => {
  console.log(chalk.blue(`${env.botName} is running...`));

  await redisClient.connect();
  console.log(chalk.blue(`Redis Database is connected...`));

  await client.login(env.discordBotToken);
  console.log(chalk.blue(`Discord Bot is initialized...`));

  await initializeMemeBot();
  console.log(chalk.blue(`Meme Bot is initialized...`));

  await initializeWelcomeBot();
  console.log(chalk.blue(`Welcome Bot is initialized...`));
})();
