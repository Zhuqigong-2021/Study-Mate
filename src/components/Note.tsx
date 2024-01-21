"use client";
import React, { useState } from "react";
import { Note as NoteModel } from "@prisma/client";

import AddEditNoteDialog from "./AddEditNoteDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
interface NoteProps {
  note: NoteModel;
}
const Note = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;
  const createUpdateAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();
  console.log("this is my note:" + note);
  return (
    <>
      <Card
        className="cursor-pointer  transition-shadow hover:shadow-lg"
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createUpdateAtTimestamp}
            {wasUpdated && "(updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap">{note.description}</p>
        </CardContent>
      </Card>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default Note;
