import React from "react";
import { idProps } from "../page";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import ReviewNoteQuestion from "@/components/ReviewNoteQuestion";
const page = async ({ params }: idProps) => {
  const { id } = params;
  const { userId } = auth();
  const note = await prisma.note.findUnique({ where: { id: Number(id) } });
  if (!note) throw Error("Note not found");

  if (!userId) throw Error("userId undefined");
  const singleNoteWithDetails = await prisma.note.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      title: true,
      description: true,
      questions: {
        include: {
          choices: {
            select: {
              content: true,
              answer: true,
            },
          },
        },
      },
    },
  });
  if (!singleNoteWithDetails) throw Error("Note not found");

  return (
    <div className="grid gap-3" suppressHydrationWarning={true}>
      <ReviewNoteQuestion note={singleNoteWithDetails} />
    </div>
  );
};

export default page;
