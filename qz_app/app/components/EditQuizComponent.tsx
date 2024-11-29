import { useState } from "react";
import { useRouter } from "next/navigation";
import EditQuestionCard from "./EditQuestionCard";
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { useQuestionStore, useQuizStore } from "@/app/store/useQuestionStore";
import EditTitleDialog from "./EditTitleDialog";
import { Loader2 } from "lucide-react";

interface EditableQuizComponentProps {
  collectionName: string;
  questions: Question[];
}

const EditQuizComponent: React.FC<EditableQuizComponentProps> = ({ collectionName, questions }) => {
  const getQuestions = useQuestionStore((state) => state.getQuestions);
  const getQuiz = useQuizStore((state) => state.getQuiz);

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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
      }
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${isSaving ? "pointer-events-none opacity-50" : ""}`}>
      <div className="flex justify-between items-center py-4">
        <h2 className="text-xl font-bold capitalize">{collectionName}</h2>
        <EditTitleDialog title={collectionName} />
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <div key={index}>
            <EditQuestionCard question={question}></EditQuestionCard>
          </div>
        ))}
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
    </div>
  );
};

export default EditQuizComponent;
