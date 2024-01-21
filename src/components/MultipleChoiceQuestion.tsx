import React from "react";
import { ChoiceType, QuestionType } from "./ReviewNoteQuestion";
import { CardContent, CardTitle } from "./ui/card";
interface multipleProps {
  question: QuestionType;
  selectedChoice: string | null;
  onChange: (questionId: number, choiceId: number | undefined) => void;
}
const MultipleChoiceQuestion = ({
  question,
  selectedChoice,
  onChange,
}: multipleProps) => {
  const handleCheckboxChange = (choiceId: number) => {
    onChange(
      Number(question.id),
      Number(selectedChoice) === Number(choiceId)
        ? undefined
        : Number(choiceId),
    );
  };
  return (
    <CardContent>
      <CardTitle className="mb-4">{question.questionTitle}</CardTitle>
      {question.choices.map((c: ChoiceType, index: number) => {
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
        // console.log("choice id: " + c.id);
        return (
          <CardContent
            key={c.id}
            className={`border-grey-600  relative my-2 flex h-[40px] items-center rounded-md border  text-left `}
          >
            <input
              type="checkbox"
              className="absolute -left-5 top-[50%] -translate-y-[50%] "
              value={c.id}
              checked={Number(selectedChoice) === Number(c.id)}
              onChange={() => handleCheckboxChange(Number(c.id))}
            />
            <span className="absolute top-[50%] -translate-y-[50%]">
              {choiceLetter + "."} &nbsp;&nbsp;
              {c.content}
            </span>
          </CardContent>
        );
      })}
    </CardContent>
  );
};

export default MultipleChoiceQuestion;
