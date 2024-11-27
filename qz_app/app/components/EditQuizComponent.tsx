import { useState } from "react";
import { useRouter } from "next/navigation";
import EditQuestionCard from "./EditQuestionCard";
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { useQuestionStore, useQuizStore } from "@/app/store/useQuestionStore";
import EditTitleDialog from "./EditTitleDialog";

interface EditableQuizComponentProps {
  collectionName: string;
  questions: Question[];
}

const EditQuizComponent: React.FC<EditableQuizComponentProps> = ({ collectionName, questions }) => {
  const getQuestions = useQuestionStore((state) => state.getQuestions);
  const getQuiz = useQuizStore((state) => state.getQuiz);

  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
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
        setIsSaved(true);
        router.push(`/collection?id=${quiz.id}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
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
      <Button onClick={handleSave} disabled={isSaved}>
        Save Quiz
      </Button>
    </div>
  );
};

export default EditQuizComponent;
