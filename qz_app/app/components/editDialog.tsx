import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/questions";
import { useQuestionStore } from "@/app/store/useQuestionStore";
import { Pencil, GripVertical, Trash2 } from "lucide-react";

interface EditDialogProps {
    question: Question;
}

const EditDialog: React.FC<EditDialogProps> = ({ question }) => {
    const [dialogOpen , setDialogOpen] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(question.problem);
    const [editedAnswers, setEditedAnswers] = useState(question.answers);
    const updateQuestion = useQuestionStore((state) => state.updateQuestion);

    const handleSave = () => {
        if (window.confirm("Are you sure you want to save the changes?")) {
            updateQuestion({
                ...question,
                problem: editedQuestion,
                answers: editedAnswers.map((answerObj, index) => ({
                    ...answerObj,
                    answer: editedAnswers[index].answer,
                })),
            });
            setDialogOpen(false);
        }
    };

    const handleDiscard = () => {
        if (window.confirm("Are you sure you want to discard the changes?")) {
            setEditedQuestion(question.problem);
            setEditedAnswers(question.answers);
            setDialogOpen(false);
        }
    };

    const isSaveDisabled = 
        editedQuestion === question.problem && 
        editedAnswers.every((answer, index) => answer === question.answers[index]);

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
              className="col-span-4"
            />
            {editedAnswers.map((answerObj, index) => (
              <div key={answerObj.id}  className="flex items-center col-span-4">
                <Input
                  key={index}
                  value={answerObj.answer}
                  onChange={(e) => {
                    const newAnswers = [...editedAnswers];
                    newAnswers[index] = { ...newAnswers[index], answer: e.target.value };
                    setEditedAnswers(newAnswers);
                  }}
                />
                <Trash2 className="text-muted hover:text-primary"/>
                <GripVertical className="text-muted hover:text-primary"/>
              </div>
            ))}
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

export default EditDialog;
