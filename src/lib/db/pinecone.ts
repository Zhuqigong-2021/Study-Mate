import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

const pinecone = new Pinecone({
  apiKey: "31a1b1a8-0f86-47b7-980c-51e56017e94c",
});

export const notesIndex = pinecone.Index("chat");
