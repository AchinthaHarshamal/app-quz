import { useState } from "react";
import { Question } from "@/types/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Circle, CircleCheck } from "lucide-react";

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
          <Dialog>
            <DialogTrigger>
              <Pencil />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <div className="grid  grid-cols-4 gap-4 py-4">
                <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                <Input id="username" defaultValue="xxxx" className="col-span-3" />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
                <Button>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
