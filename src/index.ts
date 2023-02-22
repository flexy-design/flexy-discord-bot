import chalk from "chalk";
import { initializeChatGPTBot } from "./bot/chatGPT";
import { initializeCreateAPITokenCommand } from "./bot/createAPIToken";
import { initializeFortuneBot } from "./bot/fortune";
import { initializeHouseWelcomeBot } from "./bot/houseCodeWelcome";
import { initializeMemeBot } from "./bot/meme";
import { initializeWelcomeBot } from "./bot/welcome";
import { client, houseCodeClient } from "./discord";
import { env } from "./env";
import { registerHealthCheck } from "./health";
import { redisClient } from "./redis";

void (async () => {
  console.log(chalk.blue(`${env.botName} is running...`));

  await redisClient.connect();
  console.log(chalk.blue(`Redis Database is connected...`));

  await client.login(env.discordBotToken);
  await houseCodeClient.login(env.houseCodeBotToken);
  console.log(chalk.blue(`Discord Bot is initialized...`));

  await initializeMemeBot();
  console.log(chalk.blue(`Meme Bot is initialized...`));

  await initializeWelcomeBot();
  await initializeHouseWelcomeBot();
  console.log(chalk.blue(`Welcome Bot is initialized...`));

  await registerHealthCheck();
  console.log(chalk.blue(`Health Check is initialized...`));

  await initializeChatGPTBot();
  console.log(chalk.blue(`Chat GPT Bot is initialized...`));

  await initializeFortuneBot();
  console.log(chalk.blue(`Fortune Bot is initialized...`));

  await initializeCreateAPITokenCommand();
  console.log(chalk.blue(`Create API Token Command is initialized...`));
})();
