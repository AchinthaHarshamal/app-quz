import { useState } from "react";
import { Question } from "@/types/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, CircleCheck } from "lucide-react";
import EditDialog from "./editDialog";

interface QuizCardProps {
  question: Question;
}

const QuizCard: React.FC<QuizCardProps> = ({ question }) => {
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerClick = (index: number) => {
    if (index === question.correctAnswer) {
      setIsCorrect(true);
    }
  };

  return (
    <Card className={cn("w-full", { "border-green-500": isCorrect })}>
      <CardHeader>
        <CardTitle>{question.problem}</CardTitle>
        <CardDescription>{question.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full">
          {question.answers.map((answer, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn("w-full space-y-1 justify-start", {
                "bg-green-500": isCorrect && index === question.correctAnswer,
              })}
              onClick={() => handleAnswerClick(index)}
            >
              {index === question.correctAnswer ? <CircleCheck /> : <Circle />}
              {answer}
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
