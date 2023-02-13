import axios from "axios";
import { env } from "../env";
import cron from "node-cron";

import { createWelcomeImage } from "../image";
import { s3 } from "../s3";
import { readFile } from "fs/promises";
import { nanoid } from "nanoid";
import { houseCodeClient } from "../discord";

import { currentHouseCodeUserIndex } from "../gql/currentHouseCodeUserIndex";
import { updateHouseCodeUserIndex } from "../gql/updateHouseCodeUserIndex";
import { registerHouseCodeUser } from "../gql/registerHouseCodeUser";
import { findHouseHasntSentWelcome } from "../gql/findHouseHasntSentWelcome";
import { updateHouseHasWelcomeSent } from "../gql/updateHouseHasWelcomeSent";

const welcomeText = `안녕하세요 **@blabla** 님! **HouseCode** 에 참여해주셔서 감사드려요! 커뮤니티에 **__111th user__** 로 참여해주셨어요! :tada::tada:
커뮤니티 활동 전 반드시 housecode.org 에 등록된 필수 가이드를 읽어주세요!

배울때 내가 배우는 것을 남에게 공유하는 경험은 꼭 필요한 과정이고, 마찬가지로 남이 공부하는 모습을 보는 것 역시 너무 소중한 경험이에요.

A.I 에게 받은 좋은 답변을 남에게 공유함과 동시에 이러한 경험을 하게 되면서 좋은 정보가 쌓여 서로 시너지를 받아서 공부에 더욱 가속도가 붙게 만들 수 있을거라 생각해요.

A.I 를 이용한 자습을 하는 분들을 도울 멘토분들 역시 모집하고 있으니 참여를 부탁드려요! :relaxed:`;

const dinnerText = `@everyone

오늘 하루도 다들 고생하셨어요! ☺️ 벌써 9시네요!
보람찬 하루를 만들기 위해서, 저녁을 마무리 할 겸
궁금한 것을 인공지능에게 묻고
공부방에 공유해보는 시간을 가지봐요!
여러분들의 내일 하루도 화이팅입니다! 💪

Chat GPT -> https://chat.openai.com`;

export const initializeHouseWelcomeBot = () => {
  // * New User Insert
  houseCodeClient.on("guildMemberAdd", async (member) => {
    const imageUrl = member.user.displayAvatarURL({
      extension: "png",
      size: 256,
    });

    const result = await registerHouseCodeUser({
      adminToken: env.cmsAdminToken,
      communityId: member.id,
      name: member.user.username,
      profileUrl: imageUrl,
    });
  });

  let isRunning = false;

  // * cron every 21:30 (UTC+9)
  cron.schedule(
    "0 00 21 * * *",
    async () => {
      await axios.post(env.welcomeHouseWebHookUrl, {
        content: dinnerText,
      });
    },
    {
      scheduled: true,
      timezone: "Asia/Seoul",
    }
  );

  // * cron every 10 second
  cron.schedule("*/10 * * * * *", async () => {
    if (isRunning) return;
    try {
      const { data: newUser } = await findHouseHasntSentWelcome({
        adminToken: env.cmsAdminToken,
      });

      const { index } =
        (
          await currentHouseCodeUserIndex({
            adminToken: env.cmsAdminToken,
          })
        ).data ?? {};

      if (newUser?.communityId && index !== undefined) {
        await updateHouseCodeUserIndex({
          adminToken: env.cmsAdminToken,
          index: index + 1,
        });

        const result = await updateHouseHasWelcomeSent({
          id: newUser.id,
          hasWelcomeSent: true,
          adminToken: env.cmsAdminToken,
          index: String(index),
        });

        console.log(`[Welcome/(${index})] result:`, result);

        try {
          const userImageLocalPath = await createWelcomeImage({
            index,
            imageUrl: newUser.profileUrl,
            userName: newUser.name,
            communityName: "HouseCode",
            skin: "house-welcome-card",
          });

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
    await axios.post(env.welcomeHouseWebHookUrl, {
      content: welcomeText
        .replace(`**@blabla**`, `**<@${communityId}>**`)
        .replace("#🎉｜introduces", `<#${env.introducesChannelId}>`)
        .replace(`**__111th user__**`, `**__${index}번째 참여자__**`),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await axios.post(env.welcomeHouseWebHookUrl, {
      content: imageUrl,
    });
  } catch (e) {}
};
