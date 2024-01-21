"use client";
import React, { useState } from "react";
import { ChoiceType, NoteProps, QuestionType } from "./ReviewNoteQuestion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import EditNoteQuestion from "./EditNoteQuestion";

const EditNote = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  return (
    <>
      <Card
        className="relative cursor-pointer pb-10 transition-shadow hover:shadow-lg"
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap">{note.description}</p>
        </CardContent>

        <CardHeader>
          {note.questions.map((q: QuestionType, i: number) => {
            return (
              <CardContent key={q.id}>
                <CardTitle className="mb-4">{q.questionTitle}</CardTitle>
                {q.choices.map((c: ChoiceType, index: number) => {
                  let choiceLetter =
                    index === 0
                      ? "A"
                      : index === 1
                        ? "B"
                        : index === 2
                          ? "C"
                          : index === 3
                            ? "D"
                            : index === 4
                              ? "E"
                              : index === 5
                                ? "F"
                                : index === 6
                                  ? "G"
                                  : "H";
                  let answer = c.answer;
                  // console.log(c.id);
                  return (
                    <CardContent
                      key={c?.id}
                      className="relative my-2 min-h-[40px] rounded-sm border  border-slate-300"
                    >
                      <span className="absolute top-[50%] -translate-y-[50%]">
                        {choiceLetter + "."} &nbsp;&nbsp;
                        {c.content}
                      </span>
                    </CardContent>
                  );
                })}
              </CardContent>
            );
          })}
          {note.questions.length === 0 && (
            <CardContent className="font-bold ">
              You have no questions for the time being!
            </CardContent>
          )}
        </CardHeader>
        <CardFooter className="py-4"></CardFooter>
        <Button asChild className="absolute bottom-5 right-10">
          <Link href="/notes">Back</Link>
        </Button>
      </Card>
      <EditNoteQuestion
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default EditNote;
