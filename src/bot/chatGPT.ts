// * 개발 목표: 디스코드 특정 채널에서 인공지능이 답변할 수 있게 만들기
// * 개발 제약: Open AI 의 API 를 이용하기 (Chat GPT 는 아직 API 가 없음)

import type { Message } from "discord.js";
import { houseCodeClient } from "../discord";
import { questionToAI } from "../gpt";

const questionChannelId = "1072405270996733992";

export const initializeChatGPTBot = async () => {
  // * 테스트 채널에서 디스코드 채팅을 읽어오기
  houseCodeClient.on("messageCreate", async (message: Message) => {
    // * 나 자신이면 패스
    if (message.author.id === houseCodeClient.user.id) return;

    // * 메세지에 sharegpt.com 이 포함되어 있으면 넘기기
    const isMessageHaveSharegpt = /sharegpt\.com/g.test(message.content);
    if (isMessageHaveSharegpt) return;

    // * 메세지에 이미지가 포함되어 있으면 넘기기
    const isMessageHaveImage = message.attachments.size > 0;
    if (isMessageHaveImage) return;

    // * 채팅에 답장 스레드 만들어서 메세지 작성하기
    if (message.channel.id === questionChannelId) {
      // * 3단계 채팅을 읽어와서 인공지능에게 질문하기
      const replyMessage = await message.reply(
        "인공지능이 답변을 작성하는 중이에요..."
      );

      const encodedQuestion = encodeURIComponent(message.content);
      const perplexityUrl = `https://www.perplexity.ai/?q=${encodedQuestion}`;

      try {
        const text = await questionToAI(message.content);
        if (encodedQuestion.length <= 600) {
          await replyMessage.edit(
            `${text}\n\nPerplexity A.I 검색결과: ${perplexityUrl}`
          );
        } else {
          await replyMessage.edit(text);
        }

        const random = Math.floor(Math.random() * 3) + 1;
        if (random === 1) await message.react("👍");
        if (random === 2) await message.react("👏");
        if (random === 3) await message.react("🙏");
      } catch (e) {
        console.log(e);
        if (encodedQuestion.length > 600) {
          replyMessage.edit(
            "Open AI 서버가 현재 트래픽이 많아 연결이 어렵다네요.\n조금 있다가 다시 시도해주시면 응답해드릴게요!"
          );
        } else {
          replyMessage.edit(
            "Open AI 서버가 현재 트래픽이 많아 연결이 어렵다네요.\n대신 Perplexity A.I 에서 검색결과를 보여드릴게요!\n\n" +
              perplexityUrl
          );
        }
      }
    }
  });
};
