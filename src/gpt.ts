import axios from "axios";
import { env } from "./env";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  // * Open AI 키 얻는 주소: https://beta.openai.com/account/api-keys
  apiKey: env.openAIKey,
});
const openai = new OpenAIApi(configuration);

const questionPrompt = `"---" 아래의 토픽에 대해 설명하거나 코드를 작성해줘.
아래의 옵션들을 지켜줘.

- Tone : 친근한
- Answer me in Korean
- Give me feedback on my question
- Just tell me the conclusion
---
질문:`;

export const questionToAI = async (question: string) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: questionPrompt + question,
    max_tokens: 1000,
  });

  return completion.data.choices[0].text;
};

const fortunePrompt = `"---" 점술가처럼 오늘의 운세를 점지해 줘
아래의 옵션들을 지켜줘

- 한국어로 대답해줘
- 좋은 결과일 수도 있어야 해
- 개인의 오늘 미래를 예지하는 듯한 말을 해줘야 해
- 좋은 운세 예시: 포기하고 싶었던 일이 빠르게 진척이 생긴다.
- 나쁜 운세 예시: 얻은 만큼 잃기도 쉬운 날이다. 수입보다는 지출 관리에 신경을 써야한다.
- 예시1.  이불 속에서 나오기 싫은 아침을 맞았다. 아침부터 눈뜨기가 힘들다. 컨디션이 별로인 날이기 때문. 아침에 세수를 하고 집에 나서는 일도 평소보다 힘들다. 주위 사람들에게 쉽게 짜증을 낼 수 있으니 미리 컨디션이 좋지 않다고 아예 선언을 해버리자. 오전에 너무 많은 에너지를 소비하면 저녁에는 거의 몽롱해질 만큼 피로해질 수 있으니 컨디션 조절에 신경쓰자. 자칫 데이트에 다크서클 드리우고 나갈 수 있겠다.
- 예시2. 좋은 것만 할 수 없는 것이 현실이다. 공은 공이요, 사는 사로다. 공과 사를 정확히 구별해야 하는 날이니, 맘에 와닿지 않는 일, 별로 내키지 않는 장소, 찝찝함이 느껴지는 사람과 만날 일이 있더라도 성심성의껏 예의를 다하고 최선을 다해야 결과가 좋다. 사사로운 감정때문에 이끌려 시야가 흐려질 경우, 그동안에 쌓아온 일들을 그르칠 수 있겠다. 객관적인 사고가 필요하겠고, 이성간에는 믿음이 최고다. 쓸데없는 의심으로 관계를 어색하게 만들지 말자.
---
오늘의 운세:
`;

export const getFortune = async () => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: fortunePrompt,
    max_tokens: 1000,
  });

  return completion.data.choices[0].text;
};
