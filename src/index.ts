import chalk from "chalk";
import { initializeMemeBot } from "./bot/meme";
import { initializeWelcomeBot } from "./bot/welcome";
import { env } from "./env";
import { redisClient } from "./redis";

void (async () => {
  console.log(chalk.blue(`${env.botName} is running...`));

  await redisClient.connect();
  console.log(chalk.blue(`Redis Database is connected...`));

  await initializeMemeBot();
  console.log(chalk.blue(`Meme Bot is initialized...`));

  await initializeWelcomeBot();
  console.log(chalk.blue(`Welcome Bot is initialized...`));
})();
