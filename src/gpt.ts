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
  console.log(completion.data.choices[0].text);
  console.log(completion.data.choices);

  return completion.data.choices[0].text;
};
