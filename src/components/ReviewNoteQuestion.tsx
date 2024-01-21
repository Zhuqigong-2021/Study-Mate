"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { SquarePen } from "lucide-react";
export interface NoteType {
  id: number;
  title: string;
  description: string;
  questions: QuestionType[];
}
interface QuestionType {
  id: number;
  questionTitle: string;
  choices: ChoiceType[];
  noteId: number;
}
interface ChoiceType {
  id?: number;
  content: string;
  answer: boolean;
}
export interface NoteProps {
  note: NoteType;
}
const ReviewNoteQuestion = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const router = useRouter();
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
          {note.questions.map((q: QuestionType, index: number) => {
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
                  return (
                    <CardContent
                      key={c.id}
                      className={`border-grey-600  relative my-2 flex h-[40px] items-center rounded-md border  text-left hover:shadow-lg ${
                        answer ? "hover:bg-green-50" : "hover:bg-red-100"
                      }`}
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
        </CardHeader>
        <SquarePen
          className="right-30 absolute right-10 top-10"
          onClick={() => {
            router.push(`/notes/&{note.id}/edit`);
          }}
        />
        <Button asChild className="absolute bottom-5 right-10">
          <Link href="/notes">Back</Link>
        </Button>
      </Card>
    </>
  );
};

export default ReviewNoteQuestion;
