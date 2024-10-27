import { useState } from "react";
import { Question } from "@/types/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";

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
    <Card className={cn("w-[0.5fr]", { "bg-green-500": isCorrect })}>
      <CardHeader>
        <CardTitle>{question.problem}</CardTitle>
      </CardHeader>
      <CardContent>
        <div key={1} className="mb-4 grid grid-cols-[1fr] items-start pb-4 last:mb-0 last:pb-0">
          {question.answers.map((answer, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full space-y-1 justify-start"
              onClick={() => handleAnswerClick(index)}
            >
              <Circle />
              {answer}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
