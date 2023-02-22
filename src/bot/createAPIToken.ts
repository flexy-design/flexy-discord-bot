import { Events } from "discord.js";
import { houseCodeClient } from "../discord";

export const initializeCreateAPITokenCommand = async () => {
  houseCodeClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "api코드-발급") return;

    const userId = interaction.user.id;
    const user = await houseCodeClient.users.fetch(userId);
    await user.send(
      `***API 코드가 발급되었습니다!***
아래 명령어를 복사해서 붙여넣어주세요!

\`\`\`
npx housecode set-api "1234567890"
\`\`\`

(이 코드를 제3자에게 공유하거나 노출하지 않도록 주의해주세요.)
("/API코드 발급" 명령어를 다시 실행하면 새 코드를 발급받을 수 있습니다.)`
    );
  });
};
