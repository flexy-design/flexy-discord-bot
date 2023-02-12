// * 개발 목표: 디스코드 특정 채널에서 인공지능이 답변할 수 있게 만들기
// * 개발 제약: Open AI 의 API 를 이용하기 (Chat GPT 는 아직 API 가 없음)

import type { Message } from "discord.js";
import { houseCodeClient } from "../discord";

const questionChannelId = "1073524923844284447";

export const initializeChatGPTBot = async () => {
  // TODO 1단계 테스트 채널에서 디스코드 채팅을 읽어오기
  houseCodeClient.on("messageCreate", (message: Message) => {
    if (message.author.bot) return;
    if (message.channel.id === questionChannelId) {
      console.log(
        `Message from ${message.author.username}: ${message.content}`
      );
      message.reply("Hello there! You sended" + message.content + "to me!");
    }

    // TODO 2단계 채팅에 답장 스레드 만들어서 메세지 작성하기
  });
};

const questionToOpenAI = async (question: string) => {
  // TODO 3단계 채팅을 읽어와서 인공지능에게 질문하기
  // TODO 4단계 인공지능이 답변한 내용 정제하기
  // TODO 5단계 2단계의 코드에 결과물로 병합시키기
};
