import axios from "axios";
import { env } from "./env";

// * Open AI 키 얻는 주소: https://beta.openai.com/account/api-keys
const API_KEY = env.openAIKey;
const API_ENDPOINT = `https://api.openai.com/v1/engines/text-davinci-003/jobs`;

export const generateText = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    API_ENDPOINT,
    {
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].text;
};

const questionPrompt = `"---" 아래의 토픽에 대해 설명하거나 코드를 작성해줘.
아래의 옵션들을 지켜줘.

- Tone : 친근한
- Answer me in Korean
- Give me feedback on my question
- Just tell me the conclusion
---
질문:`;

export const questionToAI = async (question: string) => {
  return await generateText(questionPrompt + question);
};
