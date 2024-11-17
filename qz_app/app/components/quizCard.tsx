import { useState } from "react";
import { Question } from "@/types/question";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, CircleCheck } from "lucide-react";
import EditDialog from "./editDialog";

interface QuizCardProps {
  question: Question;
}

const QuizCard: React.FC<QuizCardProps> = ({ question }) => {
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
                "bg-green-500": isCorrect && answerObj.id === question.correctAnswerID,
              })}
              onClick={() => handleAnswerClick(answerObj.id)}
            >
              {answerObj.id === question.correctAnswerID ? <CircleCheck /> : <Circle />}
              {answerObj.answer}
            </Button>
          ))}
        </div>
        <div className="flex w-full justify-end pt-1">
          <EditDialog question={question} />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
