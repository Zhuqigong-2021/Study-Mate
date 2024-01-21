import OpenAi, { OpenAI } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

export default openai;

export async function getEmbed(text: string) {
  const answer = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = answer.data[0].embedding;

  return embedding;
}
