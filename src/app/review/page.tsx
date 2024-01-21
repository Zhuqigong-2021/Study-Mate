import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import ReviewNote from "@/components/ReviewNote";

export const metadata: Metadata = {
  title: "Study Mate - Review",
};

const ReviewPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({ where: { userId } });
  // console.log(JSON.stringify(allNotes));

  return (
    <div className=" grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes?.map((note) => <ReviewNote note={note} key={note.id} />)}

      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any note yet"}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
