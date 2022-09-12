import { client } from "../discord";

export const initializeWelcomeBot = async () => {
  client.on("guildMemberAdd", (member) => {
    const imageUrl = member.avatarURL({ size: 1024, extension: "png" });
    console.log("Testing...", {
      imageUrl,
      username: member.user.username,
      id: member.id,
    });
  });
};

export const send = async () => {
  //
};
