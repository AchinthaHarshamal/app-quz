import { Question } from "@/types/question";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, CircleCheck } from "lucide-react";
import EditQuestionDialog from "./EditQuestionDialog";

interface QuizCardProps {
  question: Question;
}

const EditQuestionCard: React.FC<QuizCardProps> = ({ question }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full gap-1">
          {question.answers.map((answerObj) => (
            <Button
              key={answerObj.id}
              variant="outline"
              className={cn("w-full space-y-1 justify-start cursor-pointer", {
                "bg-emerald-200 text-emerald-600 hover:bg-emerald-200 hover:text-emerald-600":
                  answerObj.id === question.correctAnswerID,
              })}
            >
              {answerObj.id === question.correctAnswerID ? <CircleCheck /> : <Circle />}
              {answerObj.answer}
            </Button>
          ))}
        </div>
        {question.answerDescription && (
          <div className="mt-4 pb-5 p-2 border rounded-md bg-slate-200">
            <p className="text-md font-bold">Correct Answer Description :</p>
            <p>{question.answerDescription}</p>
          </div>
        )}
        <div className="flex w-full justify-end p-2">
          <EditQuestionDialog question={question} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EditQuestionCard;
