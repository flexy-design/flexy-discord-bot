import { Events } from "discord.js";
import { houseCodeClient } from "../discord";

export const initializeCreateAPITokenCommand = async () => {
  houseCodeClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "api코드-발급") return;

    const userId = interaction.user.id;
    await interaction.deferReply();
    await interaction.editReply({
      content: "API 코드를 DM으로 발송 중이에요...",
    });
    const user = await houseCodeClient.users.fetch(userId);
    await user.send(
      `**__API 코드가 발급되었습니다!__**
아래 명령어를 복사해서 붙여넣어주세요!

\`\`\`
npx housecode set-api "1234567890"
\`\`\`

(이 코드를 제3자에게 공유하거나 노출하지 않도록 주의해주세요.)
("/API코드 발급" 명령어를 다시 실행하면 새 코드를 발급받을 수 있습니다.)`
    );

    await interaction.editReply({
      content: `디스코드를 켜지 않고도 터미널에서
A.I에게 질문할 수 있게 해주는 명령어의
인증 코드를 다이렉트 메세지로 발송했어요!

**__(하우스코드는 메신저를 켜기 힘든 환경에서 어려운 문제에 직면하는__**
**__취업자 분들과 지망생 분들을 위해서 개발 창 내에서 A.I와 멘토에게__**
**__질문할 수 있는 npx housecode 라는 명령어를 제공하고 있습니다.)__**`,
    });
  });
};
