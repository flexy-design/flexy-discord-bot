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
      try {
        const text = await questionToAI(message.content);
        message.reply(text);
      } catch (e) {
        console.log(e);
        message.reply(
          "인공지능이 답변을 처리하는 중에 오류가 발생했어요.\n잠시 후 다시 시도해주세요."
        );
      }
    }
  });
};
