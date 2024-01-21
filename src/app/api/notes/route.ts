import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { createNoteSchema, deleteNoteSchema } from "@/lib/validation/note";
import { getEmbed } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" });
    }
    const { title, description, questions } = parseResult.data;
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const note = await prisma.note.create({
    //   data: {
    //     title,
    //     description,
    //     questions: { create: [] },
    //     userId,
    //   },
    // });
    const embedding = await getEmbedNote(title, description);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          description,
          questions: { create: [] },
          userId,
        },
      });

      await notesIndex.upsert([
        {
          id: note.id + "",
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "internal server error " },
      { status: 500 },
    );
  }
}

interface ChoiceType {
  id: number;
  content: string;
  answer: boolean;
  questionId: number;
}

interface QuestionType {
  id: number;
  questionTitle: string;
  noteId: number;
  choices: ChoiceType[]; // Include choices here
}
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // const parseResult = updateNoteSchema.safeParse(body);

    // if (!parseResult.success) {
    //   console.error(parseResult.error);
    //   console.log(parseResult);
    //   console.log("error parseResult is not success");
    //   return Response.json({ error: "Invalid input" }, { status: 400 });
    // }

    // const { id, title, description, questions } = parseResult.data;
    const { id, title, description, questions } = body;
    // console.log(id, title, description, questions);
    // console.log("id:" + id);
    // Fetch the existing note with its associated questions
    const existingNote = await prisma.note.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          // questionTitle: true,
          include: {
            choices: true,
          },
          // select: {
          //   id: true, // Include the 'id' field in the result
          // },
        },
      },
    });

    if (!existingNote) {
      return Response.json({ error: "Note is not found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== existingNote.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Update the note's title
    //----------/

    let updatedNote;
    updatedNote = await prisma.note.update({
      where: { id: existingNote.id },
      data: {
        title,
        description,
      },
    });

    if (questions) {
      console.log("questions: " + JSON.stringify(questions));
      for (const updatedQuestion of questions) {
        const existingQuestion = existingNote.questions.find(
          (q) => q.id === updatedQuestion.id,
        );

        if (existingQuestion) {
          // Update the question title

          await prisma.question.update({
            where: {
              id: existingQuestion?.id,
            },
            data: {
              questionTitle: updatedQuestion.questionTitle,
            },
          });

          // Update each choice
          for (const updatedChoice of updatedQuestion.choices) {
            const existingChoice = existingQuestion.choices.find(
              (c) => c.id === updatedChoice.id,
            );

            if (existingChoice) {
              await prisma.choice.update({
                where: {
                  id: existingChoice.id,
                },
                data: {
                  content: updatedChoice.content,
                  answer: updatedChoice.answer,
                },
              });
            }
          }
        } else {
          // console.log("question doesn't exist we have to create new question");
          updatedNote = await prisma.note.update({
            where: { id: existingNote.id },
            data: {
              title,
              description,
              questions: {
                create: [
                  {
                    questionTitle: questions[0].questionTitle,

                    choices: {
                      create: questions[0].choices,
                    },
                  },
                ],
              },

              userId,
            },
          });

          //this place
        }
      }
    }
    return Response.json({ updatedNote }, { status: 200 });
    //---------------------------------------------//
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

//pinecone part
//    const embedding = await getEmbedNote(title, description);

//    const note: any = await prisma.$transaction(async (tx) => {
//      // Create or update the note
//      const existingNote = await tx.note.findUnique({
//        where: { id: id }, // Specify the noteId if you have it
//        include: { questions: { include: { choices: true } } },
//      });

//      if (existingNote) {
//        // Update the note's title and description
//        const updatedNote = await tx.note.update({
//          where: { id: existingNote.id },
//          data: {
//            title,
//            description,
//          },
//        });

//        // Update or create each question and its associated title and choices
//        for (const updatedQuestion of existingNote.questions) {
//          const existingQuestion = existingNote.questions.find(
//            (q: QuestionType) => q.id === updatedQuestion.id,
//          );
//          if (existingQuestion) {
//            // Update the question title
//            await tx.question.update({
//              where: {
//                id: existingQuestion.id,
//              },
//              data: {
//                questionTitle: updatedQuestion.questionTitle,
//              },
//            });

//            // Update or create each choice
//            for (const updatedChoice of updatedQuestion.choices) {
//              const existingChoice = existingQuestion.choices.find(
//                (c: ChoiceType) => c.id === updatedChoice.id,
//              );

//              if (existingChoice) {
//                await tx.choice.update({
//                  where: {
//                    id: existingChoice.id,
//                  },
//                  data: {
//                    content: updatedChoice.content,
//                    answer: updatedChoice.answer,
//                  },
//                });
//              } else {
//                // Create new choice
//                await tx.choice.create({
//                  data: {
//                    content: updatedChoice.content,
//                    answer: updatedChoice.answer,
//                    questionId: existingQuestion.id,
//                  },
//                });
//              }
//            }
//          } else {
//            // Create new question
//            await tx.question.create({
//              data: {
//                questionTitle: updatedQuestion.questionTitle,
//                choices: {
//                  create: updatedQuestion.choices,
//                },
//                noteId: updatedNote.id,
//              },
//            });
//          }
//        }

//        return updatedNote;
//      } else {
//        // Handle case when the note doesn't exist
//        // You might want to throw an error or handle it based on your requirements
//        throw new Error("Note not found");
//      }
//    });

//    // Upsert the note in the search index
//    await notesIndex.upsert([
//      {
//        id: note.id + "",
//        values: embedding,
//        metadata: { userId },
//      },
//    ]);

//    return Response.json({ updatedNote: note }, { status: 200 });
//--------------------//

// Assuming you're using Express

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    // const numericId = Number(body.id); // Extract and convert ID to number
    const { id } = body;
    // if (isNaN(numericId)) {
    //   return Response.json({ error: "Invalid ID format" }, { status: 400 });
    // }

    // Check if the note exists and belongs to the user
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      console.log("we didn't find note");
      return Response.json({ error: "Invalid ID format" }, { status: 404 });
    }
    console.log("we find note");
    // Assuming `auth` is a function that returns the authenticated user's info
    const { userId } = auth();
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Invalid ID format" }, { status: 401 });
    }

    // Delete the note. Related questions and choices will be cascaded.
    await prisma.note.delete({
      where: {
        id,
      },
    });

    return Response.json(
      { error: "Note delete successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Error" }, { status: 500 });
  }
}

async function getEmbedNote(title: string, content: string | undefined) {
  return getEmbed(title + "\n\n" + content ?? "");
}
