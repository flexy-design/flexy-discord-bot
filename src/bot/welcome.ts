import axios from "axios";
import { client } from "../discord";
import { env } from "../env";

const welcomeText = `Hello **@blabla** thank you for joining **Flexy Design**! Welcome to the community as the **__111th user__**! :tada::tada:
We'd appreciate it if you could leave your self-introduction on the #🎉｜introduces!

Currently, moving the design to code is a very hard task. We're trying to make the work a little flexible.

Our goal is to make sure that everyone can work flexibly and that the design that everyone dreams of becomes a reality.

We need your feedback and support to get this done! :relaxed:`;

export const initializeWelcomeBot = () => {
  client.on("guildMemberAdd", async (member) => {
    const imageUrl = member.user.displayAvatarURL({
      extension: "png",
      size: 256,
    });

    console.log("Testing...", {
      imageUrl,
      username: member.user.username,
      id: member.id,
      nickname: member.nickname,
      avatar: member.avatar,
    });

    await axios.post(env.welcomeWebHookUrl, {
      content: welcomeText
        .replace(`**@blabla**`, `**<@${member.id}>**`)
        .replace("#🎉｜introduces", `<#${env.introducesChannelId}>`)
        .replace(`**__111th user__**`, `**__111th user__**`),
    });

    await axios.post(env.memeWebHookUrl, {
      content: `https://cdn.discordapp.com/attachments/1018494735490494545/1018504357769121963/Welcome.png`,
    });
  });
};

export const send = async () => {
  //
};
