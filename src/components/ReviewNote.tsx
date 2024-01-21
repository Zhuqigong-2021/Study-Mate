"use client";
import React, { useState } from "react";
import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import AddEditNoteDialog from "./AddEditNoteDialog";
import { useRouter } from "next/navigation";

interface NoteProps {
  note: NoteModel;
}

const ReviewNote = ({ note }: NoteProps) => {
  const router = useRouter();

  const createdUpdatedAtTimestamp = note.createdAt.toDateString();
  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => router.push(`/review/${note.id}`)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>{createdUpdatedAtTimestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default ReviewNote;
