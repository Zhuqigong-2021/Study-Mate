import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import AIbutton from "@/components/AIbutton";
export const metadata: Metadata = {
  title: "Study Mate - Notes",
};

const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({ where: { userId } });
  // console.log(JSON.stringify(allNotes));

  return (
    <div className=" grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes?.map((note) => <Note note={note} key={note.id} />)}

      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any note yet"}
        </div>
      )}
      <div className="absolute bottom-4 right-4">
        <AIbutton />
      </div>
    </div>
  );
};

export default NotesPage;
