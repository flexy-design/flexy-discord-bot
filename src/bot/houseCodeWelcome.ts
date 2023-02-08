import axios from "axios";
import { env } from "../env";
import cron from "node-cron";
import { registerCommunityUser } from "../gql/registerCommunityUser";
import { findHasntSentWelcome } from "../gql/findHasntSentWelcome";
import { updateHasWelcomeSent } from "../gql/updateHasWelcomeSent";
import { updateCommunityUserIndex } from "../gql/updateCommunityUserIndex";
import { createWelcomeImage } from "../image";
import { s3 } from "../s3";
import { readFile } from "fs/promises";
import { nanoid } from "nanoid";
import { currentHouseCodeUserIndex } from "../gql/currentHouseCodeUserIndex";
import { houseCodeClient } from "../discord";

const welcomeText = `안녕하세요 **@blabla** 님! **HouseCode** 에 참여해주셔서 감사드려요! 커뮤니티에 **__111th user__** 번째로 참여해주셨어요! :tada::tada:
커뮤니티 활동 전 반드시 https://housecode.org/ai-guide 의 가이드를 읽어주세요!

배울때 내가 배우는 것을 남에게 공유하는 경험은 꼭 필요한 과정이고, 마찬가지로 남이 공부하는 모습을 보는 것 역시 너무 소중한 경험이에요.

A.I 에게 받은 좋은 답변을 남에게 공유함과 동시에 이러한 경험을 하게되면서 좋은 정보가 쌓여 서로 시너지를 받아서 공부에 더욱 가속도가 붙게 만들 수 있을거라 생각해요.

A.I 를 이용한 자습을 하는 분들을 도울 멘토분들 역시 모집하고 있으니 참여를 부탁드려요! :relaxed:`;

export const initializeWelcomeBot = () => {
  // * New User Insert
  houseCodeClient.on("guildMemberAdd", async (member) => {
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
          await currentHouseCodeUserIndex({
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
            communityName: "HouseCode",
            skin: "house-welcome-card",
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
              Key: `community-welcome/house_${newUser.communityId}_${imageName}.png`,
              Body: data,
            })
            .promise();

          console.log(
            `[Welcome/(${index})] Uploaded to R2: https://static.flexy.design/community-welcome/house_${newUser.communityId}_${imageName}.png`
          );

          // send to discord
          await send({
            imageUrl: `https://static.flexy.design/community-welcome/house_${newUser.communityId}_${imageName}.png`,
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

export const sendToHouseCode = async ({
  imageUrl,
  communityId,
  index,
}: {
  imageUrl: string;
  communityId: string;
  index: number;
}) => {
  try {
    await axios.post(env.welcomeHouseWebHookUrl, {
      content: welcomeText
        .replace(`**@blabla**`, `**<@${communityId}>**`)
        .replace("#🎉｜introduces", `<#${env.introducesChannelId}>`)
        .replace(`**__111th user__**`, `**__${index}th user__**`),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await axios.post(env.welcomeHouseWebHookUrl, {
      content: imageUrl,
    });
  } catch (e) {}
};
