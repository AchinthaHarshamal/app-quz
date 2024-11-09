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
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/questions";
import { useQuestionStore } from "@/app/store/useQuestionStore";

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
                answers: editedAnswers,
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
        <Dialog  open={dialogOpen} onOpenChange={setDialogOpen}>
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
                    {editedAnswers.map((answer, index) => (
                        <Input
                            key={index}
                            value={answer}
                            onChange={(e) => {
                                const newAnswers = [...editedAnswers];
                                newAnswers[index] = e.target.value;
                                setEditedAnswers(newAnswers);
                            }}
                            className="col-span-4"
                        />
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
