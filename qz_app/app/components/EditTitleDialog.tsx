import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/app/store/useQuestionStore";
import { Pencil } from "lucide-react";

interface EditTitleDialogProps {
  title: string;
}

const EditTitleDialog: React.FC<EditTitleDialogProps> = ({ title }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const updateQuiz = useQuizStore((state) => state.updateQuiz);
  const getQuiz = useQuizStore((state) => state.getQuiz);

  const handleSave = () => {
    if (window.confirm("Are you sure you want to save the changes?")) {
      const quiz = getQuiz();
      updateQuiz({ ...quiz, topic: editedTitle });
      setDialogOpen(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard the changes?")) {
      setEditedTitle(title);
      setDialogOpen(false);
    }
  };

  const isSaveDisabled = editedTitle === title;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Pencil />
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Edit Title</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            id="title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-lg font-bold text-wrap"
          />
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

export default EditTitleDialog;
