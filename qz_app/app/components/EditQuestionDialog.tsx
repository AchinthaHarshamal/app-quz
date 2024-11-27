import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/question";
import { useQuestionStore } from "@/app/store/useQuestionStore";
import { Pencil, GripVertical, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface EditDialogProps {
  question: Question;
}

const EditQuestionDialog: React.FC<EditDialogProps> = ({ question }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswers, setEditedAnswers] = useState(question.answers);
  const [editedAnswerDescription, setEditedAnswerDescription] = useState(question.answerDescription || "");
  const [correctAnswerId, setCorrectAnswerId] = useState(question.correctAnswerID || "");
  const updateQuestion = useQuestionStore((state) => state.updateQuestion);

  const handleSave = () => {
    if (window.confirm("Are you sure you want to save the changes?")) {
      updateQuestion({
        ...question,
        question: editedQuestion,
        answers: editedAnswers.map((answerObj, index) => ({
          ...answerObj,
          answer: editedAnswers[index].answer,
        })),
        answerDescription: editedAnswerDescription,
        correctAnswerID: correctAnswerId,
      });
      setDialogOpen(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard the changes?")) {
      setEditedQuestion(question.question);
      setEditedAnswers(question.answers);
      setEditedAnswerDescription(question.answerDescription || "");
      setDialogOpen(false);
    }
  };

  const isSaveDisabled =
    editedQuestion === question.question &&
    editedAnswers.every((answer, index) => answer === question.answers[index]) &&
    editedAnswerDescription === (question.answerDescription || "") &&
    correctAnswerId === (question.correctAnswerID || "");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Pencil />
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <Input
            id="problem"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            className="text-lg font-bold col-span-4 text-wrap"
          />
          {editedAnswers.map((answerObj, index) => (
            <div key={answerObj.id} className="flex items-center col-span-4">
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswerId === answerObj.id}
                onChange={() => setCorrectAnswerId(answerObj.id)}
                className="mx-2 accent-[#059669]"
              />
              <Input
                key={index}
                value={answerObj.answer}
                onChange={(e) => {
                  const newAnswers = [...editedAnswers];
                  newAnswers[index] = { ...newAnswers[index], answer: e.target.value };
                  setEditedAnswers(newAnswers);
                }}
                className={`text-wrap ${correctAnswerId === answerObj.id ? 'bg-emerald-200 text-emerald-600' : ''}`}
              />

              <Trash2 className="text-muted hover:text-primary" />
              <GripVertical className="text-muted hover:text-primary" />
            </div>
          ))}
          <div className="mt-4 pb-5 p-2 col-span-4">
            <p className="text-md font-bold">Correct Answer Description :</p>
            <Textarea
              id="answerDescription"
              value={editedAnswerDescription}
              onChange={(e) => setEditedAnswerDescription(e.target.value)}
              className="p-4 text-balance overflow-hidden"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
            Save changes
          </Button>
          <Button type="button" onClick={handleDiscard}>
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionDialog;
