import { idProps } from "@/app/notes/[id]/page";
import { auth } from "@clerk/nextjs";
import React from "react";
import prisma from "@/lib/db/prisma";
import ExamNoteQuestion from "@/components/ExamNoteQuestion";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");
  const note = await prisma.note.findUnique({ where: { id: Number(id) } });
  if (!note) throw Error("Note not found");

  const singleNoteWithDetails = await prisma.note.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      questions: {
        select: {
          id: true,
          questionTitle: true,
          choices: {
            select: {
              id: true,
              content: true,
              answer: true,
            },
          },
        },
      },
    },
  });

  if (!singleNoteWithDetails) throw Error("Note Details not Found");
  if (singleNoteWithDetails.questions.length === 0) {
    redirect("/exam");
  }
  return (
    <div className="grid gap-3" suppressHydrationWarning={true}>
      {<ExamNoteQuestion note={singleNoteWithDetails} />}
    </div>
  );
};

export default page;
