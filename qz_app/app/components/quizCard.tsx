import { useState } from "react";
import { Question } from "@/types/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";

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
      </CardHeader>
      <CardContent>
        <div key={1} className="flex flex-col w-full">
          {question.answers.map((answer, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn("w-full space-y-1 justify-start", {
                "bg-green-500": isCorrect && index === question.correctAnswer,
              })}
              onClick={() => handleAnswerClick(index)}
            >
              <Circle />
              {answer}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
