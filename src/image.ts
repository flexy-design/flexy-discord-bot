import path from "path";
import puppeteer from "puppeteer";
import express from "express";
import { existsSync, mkdirSync } from "fs";

const folderPath = path.join(__dirname, "..", "export", "welcome-card");

const serveWelcomeTemplate = (skin?: string) => {
  return new Promise<() => unknown>((resolve) => {
    const app = express();
    app.use(
      express.static(
        path.join(__dirname, "..", "static", skin ?? "welcome-card")
      )
    );
    const sever = app.listen(4001, () => resolve(() => sever.close()));
  });
};

export const createWelcomeImage = async (options: {
  imageUrl?: string;
  userName: string;
  index: number;
  skin?: string;
  communityName?: string;
}) => {
  const imageFolderPath = path.join(
    __dirname,
    "..",
    "export",
    options.communityName ?? "Flexy Design"
  );
  if (!existsSync(folderPath)) mkdirSync(imageFolderPath, { recursive: true });

  const serveClose = await serveWelcomeTemplate(options.skin);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: 1100,
      height: 500,
    },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:4001");

  const bodyHandle = await page.$("body");
  await page.evaluate(
    (body, options) => {
      // Icon
      const element = body.querySelector("#prefix__b") as any;
      if (element)
        element.href.baseVal =
          options.imageUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png";

      // Name
      const text = body.querySelector(
        '[data-name="“UserName” Welcome to the Flexy Design!"]'
      );
      text.textContent = `${
        options.userName ? `“${options.userName}” ` : ""
      }Welcome to the ${options.communityName ?? "Flexy Design"}!`;

      // Index
      const index = body.querySelector('[data-name="Member #0"]');
      index.textContent =
        options.index !== undefined ? `Member #${options.index}` : "New Member";
    },
    bodyHandle,
    options
  );
  await bodyHandle.dispose();

  const screenshotPath = path.join(
    __dirname,
    "..",
    "export",
    options.communityName ?? "Flexy Design",
    `${options.index}.png`
  );

  await page.waitForResponse((response) => response.ok());
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.screenshot({
    path: screenshotPath,
  });

  serveClose();
  await browser.close();

  return screenshotPath;
};
