"use client";
import React, { useEffect, useState } from "react";
import { NoteProps, QuestionType } from "./ReviewNoteQuestion";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import { Button } from "./ui/button";
import Link from "next/link";

const ExamNoteQuestion = ({ note }: NoteProps) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [correntNumber, setCurrentNumber] = useState(0);
  const [totalQuestionNumber, setTotalQuestionNumber] = useState(
    note.questions.length,
  );
  const [result, setResult] = useState(0);
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);
    return params.toString();
  };
  const [selectedChoices, setSelectedChoices] = useState<
    Record<string, string | null>
  >({});
  const router = useRouter();
  const searchParams = useSearchParams();
  let timer = searchParams.get("timer");

  const timerFromStorage = localStorage && localStorage.getItem("timer");
  const [time, setTime] = useState(
    timerFromStorage ? Number(timerFromStorage) : Number(timer),
  );
  if (!timer && timerFromStorage) {
    () => setTime(Number(timerFromStorage));
  } else {
    console.log("we have timer");
  }

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }
  function convertMsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds,
    )}`;
  }
  useEffect(() => {
    let timer: any;

    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
    }
    if (time === 0) {
      // router.push("/exam");
      // router.push(`/exam/${note.id}/result `);
      localStorage.removeItem("timer");
      router.push(
        `/exam/${note.id}/result` +
          "?" +
          createQueryString("correct", correntNumber.toString()) +
          "&" +
          createQueryString("total", totalQuestionNumber.toString()) +
          "&" +
          createQueryString("result", result.toString()),
      );

      toast.error("Time is up !!!");
    }
    return () => {
      clearInterval(timer);
    };
  }, [time, router, note, totalQuestionNumber, result, correntNumber]);

  // Save the current timer value to localStorage whenever it changes
  useEffect(() => {
    if (time) localStorage.setItem("timer", time.toString());
  }, [time]);

  const handleChoiceChange = (
    questionId: number,
    choiceId: number | undefined,
  ) => {
    setSelectedChoices((prevSelectedChoices) => ({
      ...prevSelectedChoices,
      [questionId]: choiceId,
    }));
  };
  useEffect(() => {
    const checkAnswers = () => {
      let correctCount = 0;

      for (const question of note.questions) {
        const selectedChoice = selectedChoices[question.id];
        const correctAnswer = question.choices.find(
          (choice) => choice.answer,
        )?.id;

        if (Number(selectedChoice) === Number(correctAnswer)) {
          correctCount++;
        }
      }

      setCurrentNumber(correctCount);
      setTotalQuestionNumber(note.questions.length);
      setResult(Math.round((correctCount / note.questions.length) * 100));
    };

    // Call the function directly here to avoid missing dependencies warnings
    checkAnswers();
  }, [
    selectedChoices,
    note.questions,
    setCurrentNumber,
    setTotalQuestionNumber,
    setResult,
  ]);

  return (
    <>
      <Card
        className="transition-show relative cursor-pointer pb-10 hover:shadow-lg"
        onClick={() => setShowAddEditNoteDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap ">{note.description}</p>
        </CardContent>
        <CardHeader>
          {note.questions.map((question: QuestionType, index: number) => {
            return (
              <MultipleChoiceQuestion
                key={question.id}
                question={question}
                selectedChoice={selectedChoices[question.id] || null}
                onChange={handleChoiceChange}
              />
            );
          })}
        </CardHeader>
        <Button
          className="absolute bottom-5 right-5"
          onClick={() => {
            if (localStorage.getItem("timer")) localStorage.removeItem("timer");
          }}
        >
          <Link
            href={{
              pathname: `/exam/${note.id}/result`,
              query: {
                correct: correntNumber,
                total: totalQuestionNumber,
                result: result,
              },
            }}
          >
            Confirm
          </Link>
        </Button>
        <CardContent className="absolute right-5 top-5 text-teal-500">
          {convertMsToTime(Number(time))}
        </CardContent>
      </Card>
    </>
  );
};

export default ExamNoteQuestion;
