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

  const handleAnswerClick = (id: string) => {
    if (id === question.correctAnswerID) {
      setIsCorrect(true);
    }
  };

  return (
    <Card className={cn("w-full", { "border-green-500": isCorrect })}>
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full">
          {question.answers.map((answerObj) => (
            <Button
              key={answerObj.id}
              variant="ghost"
              className={cn("w-full space-y-1 justify-start", {
                "border-green-500": isCorrect && answerObj.id === question.correctAnswerID,
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
