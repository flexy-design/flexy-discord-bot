import axios from "axios";
import chalk from "chalk";
import { env } from "../env";
import { pink } from "../redis";
import cron from "node-cron";

export const initializeMemeBot = async () => {
  cron
    .schedule("0 13 * * 1", () => {
      send();
    })
    .start();
};

export const send = async () => {
  const imageUrl = await getOnlyNewMemes();
  if (!imageUrl) return;

  console.log(chalk.blue(`[Meme Bot] Sending meme to discord...`));
  await axios.post(env.memeWebHookUrl, {
    content: imageUrl,
  });
};

export const getOnlyNewMemes = async () => {
  const memes = await scraping();
  let isFirstLoop = true;
  for (const meme of memes) {
    const isNewest = await pink.checkIsNewest({
      list: "community-meme",
      item: meme.id,
      isFirstLoop,
      limit: 300,
    });

    if (isFirstLoop) isFirstLoop = false;

    if (isNewest) {
      return meme.url;
    } else {
      return null;
    }
  }
};

export const scraping = async (options?: {
  subreddit?: string;
}): Promise<{ title: string; url: string; id: string }[] | null> => {
  const { subreddit } = options || {};
  try {
    const uri = `https://www.reddit.com/r/${
      subreddit || "ProgrammerHumor"
    }/new/.json?limit=30`;

    const { data } = await axios.get(uri);
    const content = data.data.children.map((child: any) => {
      return child.data;
    }) as { title: string; url: string; id: string; link_flair_text: string }[];

    return content.filter((item) => {
      return item.link_flair_text === "Meme";
    });
  } catch (e) {
    return null;
  }
};
