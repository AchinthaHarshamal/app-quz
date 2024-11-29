import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuestionStore, useQuizStore } from "@/app/store/useQuestionStore";
import { Plus, X } from "lucide-react"; // Add this import
import { Answer } from "@/types/question";

const NewQuestionDialog: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<Answer[]>([{ id: uuidv4(), answer: "" }]);
  const [newAnswerDescription, setNewAnswerDescription] = useState("");
  const [correctAnswerId, setCorrectAnswerId] = useState("");
  const updateQuestion = useQuestionStore((state) => state.updateQuestion);
  const addQuestionId = useQuizStore((state) => state.addQuestionId); // Add this line

  const handleSave = () => {
    if (!newQuestion.trim()) {
      alert("Question is required.");
      return;
    }
    if (newAnswers.some((answer) => !answer.answer.trim())) {
      alert("All answers must be filled.");
      return;
    }
    if (!correctAnswerId) {
      alert("You must select a correct answer.");
      return;
    }

    if (window.confirm("Are you sure you want to save the new question?")) {
      const newQuestionId = uuidv4();
      updateQuestion({
        id: newQuestionId,
        question: newQuestion,
        answers: newAnswers,
        answerDescription: newAnswerDescription,
        correctAnswerID: correctAnswerId,
      });
      addQuestionId(newQuestionId);

      setDialogOpen(false);
      setNewQuestion("");
      setNewAnswers([{ id: uuidv4(), answer: "" }]);
      setNewAnswerDescription("");
      setCorrectAnswerId("");
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard the changes?")) {
      setDialogOpen(false);
      setNewQuestion("");
      setNewAnswers([{ id: uuidv4(), answer: "" }]);
      setNewAnswerDescription("");
      setCorrectAnswerId("");
    }
  };

  const handleAddAnswer = () => {
    if (newAnswers.length >= 4) {
      alert("You can only add up to 4 answers.");
      return;
    }
    if (newAnswers[newAnswers.length - 1].answer.trim() !== "") {
      setNewAnswers([...newAnswers, { id: uuidv4(), answer: "" }]);
    } else {
      alert("Please fill in the previous answer before adding a new one.");
    }
  };

  const handleRemoveAnswer = (id: string) => {
    if (newAnswers.length > 1) {
      setNewAnswers(newAnswers.filter((answer) => answer.id !== id));
    } else {
      alert("You must have at least one answer.");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Plus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>New Question</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <Input
            id="newQuestion"
            placeholder="Enter your question here"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="text-lg font-bold col-span-4 text-wrap"
          />
          {newAnswers.map((answerObj, index) => (
            <div key={answerObj.id} className="flex items-center col-span-4">
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswerId === answerObj.id}
                onChange={() => setCorrectAnswerId(answerObj.id)}
                className="mx-2 accent-[#059669]"
              />
              <Input
                value={answerObj.answer}
                placeholder={`Answer ${index + 1}`}
                onChange={(e) => {
                  const updatedAnswers = [...newAnswers];
                  updatedAnswers[index] = { ...updatedAnswers[index], answer: e.target.value };
                  setNewAnswers(updatedAnswers);
                }}
                className={`text-wrap ${correctAnswerId === answerObj.id ? "bg-emerald-200 text-emerald-600" : ""}`}
              />
              <X className="ml-2 cursor-pointer" onClick={() => handleRemoveAnswer(answerObj.id)} />
            </div>
          ))}
          <Button type="button" onClick={handleAddAnswer} className="col-span-4">
            Add Answer
          </Button>
          <div className="mt-4 pb-5 p-2 col-span-4">
            <p className="text-md font-bold">Correct Answer Description :</p>
            <Textarea
              id="newAnswerDescription"
              placeholder="Enter the description for the correct answer"
              value={newAnswerDescription}
              onChange={(e) => setNewAnswerDescription(e.target.value)}
              className="p-4 text-balance overflow-hidden"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
          <Button type="button" onClick={handleDiscard}>
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewQuestionDialog;
