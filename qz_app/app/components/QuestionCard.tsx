import { useState } from "react";
import { Question } from "@/types/question";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickedAnswerID, setClickedAnswerID] = useState<string | null>(null);

  const handleAnswerClick = (id: string) => {
    if (isClicked) return;
    setClickedAnswerID(id);
    if (id === question.correctAnswerID) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setIsClicked(true);
  };

  return (
    <Card
      className={cn("w-full", {
        "border-emerald-300 shadow-emerald-500/50": isCorrect,
        "border-red-300 shadow-red-500/50": isClicked && !isCorrect,
      })}
    >
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full gap-1">
          {question.answers.map((answerObj) => (
            <Button
              key={answerObj.id}
              variant="ghost"
              className={cn("w-full space-y-1 justify-start", {
                "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600":
                  isCorrect && answerObj.id === question.correctAnswerID,
                "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-600":
                  isClicked && clickedAnswerID === answerObj.id && answerObj.id !== question.correctAnswerID,
                "border border-green-200": isClicked && !isCorrect && answerObj.id === question.correctAnswerID,
              })}
              onClick={() => handleAnswerClick(answerObj.id)}
            >
              {answerObj.answer}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
