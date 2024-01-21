import { notesIndex } from "@/lib/db/pinecone";
import openai, { getEmbed } from "@/lib/openai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { auth } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;
    const someMessages = messages.slice(-6);

    const embedding = await getEmbed(
      someMessages.map((message) => message.content).join("\n"),
    );
    const { userId } = auth();
    const queryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
      filter: { userId },
    });

    const relevant = await prisma?.note.findMany({
      where: {
        id: {
          in: queryResponse.matches.map((match) => Number(match.id)),
        },
      },
    });
    console.log("notes found", relevant);
    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevant
          ?.map(
            (note) => `Title: ${note.title}\n\nContent:\n${note.description}`,
          )
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...someMessages],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
