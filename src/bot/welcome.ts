import axios from "axios";
import { client } from "../discord";
import { env } from "../env";
import cron from "node-cron";
import { registerCommunityUser } from "../gql/registerCommunityUser";
import { findHasntSentWelcome } from "../gql/findHasntSentWelcome";
import { updateHasWelcomeSent } from "../gql/updateHasWelcomeSent";
import { currentCommunityUserIndex } from "../gql/currentCommunityUserIndex";
import { updateCommunityUserIndex } from "../gql/updateCommunityUserIndex";
import { createWelcomeImage } from "../image";
import { s3 } from "../s3";
import { readFile } from "fs/promises";
import { nanoid } from "nanoid";

const welcomeText = `Hello **@blabla** thank you for joining **Flexy Design**! Welcome to the community as the **__111th user__**! :tada::tada:
We'd appreciate it if you could leave your self-introduction on the #🎉｜introduces!

Currently, moving the design to code is a very hard task. We're trying to make the work a little flexible.

Our goal is to make sure that everyone can work flexibly and that the design that everyone dreams of becomes a reality.

We need your feedback and support to get this done! :relaxed:`;

export const initializeWelcomeBot = () => {
  // * New User Insert
  client.on("guildMemberAdd", async (member) => {
    const imageUrl = member.user.displayAvatarURL({
      extension: "png",
      size: 256,
    });

    const result = await registerCommunityUser({
      adminToken: env.cmsAdminToken,
      communityId: member.id,
      name: member.user.username,
      profileUrl: imageUrl,
    });

    console.log(
      `New Community User Registered: "${member.user.username}" (${member.id}) [result: ${result.type}]`
    );
  });

  let isRunning = false;
  // * cron every 10 second
  cron.schedule("*/10 * * * * *", async () => {
    if (isRunning) return;
    try {
      const { data: newUser } = await findHasntSentWelcome({
        adminToken: env.cmsAdminToken,
      });

      const { index } =
        (
          await currentCommunityUserIndex({
            adminToken: env.cmsAdminToken,
          })
        ).data ?? {};

      if (newUser?.communityId && index !== undefined) {
        console.log(
          `[Welcome/(${index})] Sending Welcome Message to ${newUser.name}...`
        );
        await updateCommunityUserIndex({
          adminToken: env.cmsAdminToken,
          index: index + 1,
        });
        console.log(
          `[Welcome/(${index})] Updated Community User Index to ${index + 1}`
        );

        try {
          const userImageLocalPath = await createWelcomeImage({
            index,
            imageUrl: newUser.profileUrl,
            userName: newUser.name,
          });
          console.log(
            `[Welcome/(${index})] Created Welcome Image: ${userImageLocalPath}`
          );

          // read image for upload s3
          const data = await readFile(userImageLocalPath);

          const imageName = nanoid();

          // upload to s3
          await s3
            .putObject({
              Bucket: "flexy-design",
              Key: `community-welcome/${newUser.communityId}_${imageName}.png`,
              Body: data,
            })
            .promise();

          console.log(
            `[Welcome/(${index})] Uploaded to R2: https://static.flexy.design/community-welcome/${newUser.communityId}_${imageName}.png`
          );

          // send to discord
          await send({
            imageUrl: `https://static.flexy.design/community-welcome/${newUser.communityId}_${imageName}.png`,
            communityId: newUser.communityId,
            index,
          });

          console.log(`[Welcome/(${index})] Sent to Discord`);

          const result = await updateHasWelcomeSent({
            id: newUser.id,
            hasWelcomeSent: true,
            adminToken: env.cmsAdminToken,
            index: String(index),
          });

          console.log(`[Welcome/(${index})] result:`, result);
        } catch (e) {
          console.log("[Welcome] Error Occured. Skip this user.", e);
        }
      }
    } catch (e) {
      console.log("[Welcome] Error Occured. Skip this user.", e);
    }
    isRunning = false;
  });
};

export const send = async ({
  imageUrl,
  communityId,
  index,
}: {
  imageUrl: string;
  communityId: string;
  index: number;
}) => {
  try {
    await axios.post(env.welcomeWebHookUrl, {
      content: welcomeText
        .replace(`**@blabla**`, `**<@${communityId}>**`)
        .replace("#🎉｜introduces", `<#${env.introducesChannelId}>`)
        .replace(`**__111th user__**`, `**__${index}th user__**`),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await axios.post(env.welcomeWebHookUrl, {
      content: imageUrl,
    });
  } catch (e) {}
};
