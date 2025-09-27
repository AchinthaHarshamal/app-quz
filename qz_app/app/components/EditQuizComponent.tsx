import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditQuestionCard from "./EditQuestionCard";
import { Question, Answer } from "@/types/question";
import { Button } from "@/components/ui/button";
import { useQuestionStore, useQuizStore } from "@/app/store/useQuestionStore";
import EditableQuizInfoCard from "./EditableQuizInfoCard";
import { Loader2, Plus, X } from "lucide-react";
import NewQuestionDialog from "./NewQuestionDialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

interface EditableQuizComponentProps {
  collectionName: string;
  questions: Question[];
}

interface NewQuestionDialogWrapperProps {
  onBeforeOpen: () => boolean;
}

const MAX_ANSWERS = 4;

const NewQuestionDialogWrapper: React.FC<NewQuestionDialogWrapperProps> = ({ onBeforeOpen }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<Answer[]>([{ id: uuidv4(), answer: "" }]);
  const [newAnswerDescription, setNewAnswerDescription] = useState("");
  const [correctAnswerId, setCorrectAnswerId] = useState("");
  const updateQuestion = useQuestionStore((state) => state.updateQuestion);
  const addQuestionId = useQuizStore((state) => state.addQuestionId);

  const handleTriggerClick = () => {
    const canOpen = onBeforeOpen();
    if (canOpen) {
      setDialogOpen(true);
    }
  };

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
    if (newAnswers.length >= MAX_ANSWERS) {
      alert(`You can only add up to ${MAX_ANSWERS} answers.`);
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
    <>
      <button onClick={handleTriggerClick} className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
        <Plus className="h-6 w-6 text-gray-500" />
      </button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <X className="ml-2 text-red-500 cursor-pointer" onClick={() => handleRemoveAnswer(answerObj.id)} />
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddAnswer}
              className="col-span-4"
              disabled={newAnswers.length >= MAX_ANSWERS}
            >
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
    </>
  );
};

const EditQuizComponent: React.FC<EditableQuizComponentProps> = ({ collectionName, questions }) => {
  const getQuestions = useQuestionStore((state) => state.getQuestions);
  const getQuiz = useQuizStore((state) => state.getQuiz);
  const addQuestion = useQuestionStore((state) => state.addQuestion);
  const quiz = getQuiz();

  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  // Create a default question
  const createDefaultQuestion = (): Question => ({
    id: `default-${Date.now()}`,
    question: "What is your question?",
    correctAnswerID: `answer-${Date.now()}-1`,
    answerDescription: "",
    answers: [
      { id: `answer-${Date.now()}-1`, answer: "Option 1" },
      { id: `answer-${Date.now()}-2`, answer: "Option 2" },
      { id: `answer-${Date.now()}-3`, answer: "Option 3" },
      { id: `answer-${Date.now()}-4`, answer: "Option 4" },
    ],
  });

  // Add default question if no questions exist
  useEffect(() => {
    const currentQuestions = getQuestions();
    if (currentQuestions.length === 0) {
      const defaultQuestion = createDefaultQuestion();
      addQuestion(defaultQuestion);
    }
  }, [getQuestions, addQuestion]);

  // Check if the default question has been edited
  const isDefaultQuestionEdited = () => {
    const currentQuestions = getQuestions();
    if (currentQuestions.length === 0) return false;
    
    const firstQuestion = currentQuestions[0];
    return (
      firstQuestion.question !== "What is your question?" ||
      firstQuestion.answers.some(answer => 
        answer.answer !== "Option 1" && 
        answer.answer !== "Option 2" && 
        answer.answer !== "Option 3" && 
        answer.answer !== "Option 4"
      ) ||
      firstQuestion.answerDescription !== ""
    );
  };

  // Handle new question dialog click
  const handleNewQuestionClick = () => {
    if (!isDefaultQuestionEdited()) {
      setShowNotification(true);
      return false; // Prevent dialog from opening
    }
    return true; // Allow dialog to open
  };

  const handleSave = async () => {
    setIsSaving(true);
    const quiz = getQuiz();
    const questions = getQuestions();
    if (quiz) {
      const response = await fetch("/api/collection/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz, questions }),
      });
      if (response.ok) {
        router.push(`/collection?id=${quiz.id}`);
        useQuestionStore.getState().reset();
        useQuizStore.getState().reset();
      }
    }
  };

  // Get current questions from store
  const currentQuestions = getQuestions();

  return (
    <div className={`flex flex-col gap-4 ${isSaving ? "pointer-events-none opacity-50" : ""}`}>
      <EditableQuizInfoCard title={collectionName} description={quiz?.description} />
      
      <div className="flex flex-col gap-2">
        {currentQuestions.map((question, index) => (
          <div key={question.id}>
            <EditQuestionCard question={question}></EditQuestionCard>
          </div>
        ))}
        <NewQuestionDialogWrapper onBeforeOpen={handleNewQuestionClick} />
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="animate-spin" /> Saving...
          </>
        ) : (
          "Save Quiz"
        )}
      </Button>

      {/* Notification Dialog */}
      <AlertDialog open={showNotification} onOpenChange={setShowNotification}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Current Question First</AlertDialogTitle>
            <AlertDialogDescription>
              Please edit the current question before adding a new one. You can modify the question text, answer options, or add a description.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNotification(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditQuizComponent;
