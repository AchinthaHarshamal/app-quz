import { useState } from "react";
import EditQuestionCard from "./EditQuestionCard";
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { useQuestionStore , useQuizStore } from "@/app/store/useQuestionStore";
interface EditableQuizComponentProps {
  collectionName: string;
  questions: Question[];
}

const EditQuizComponent: React.FC<EditableQuizComponentProps> = ({ collectionName, questions }) => {
  const getQuestions = useQuestionStore((state) => state.getQuestions);
  const getQuiz = useQuizStore((state) => state.getQuiz);

  const [isSaved, setIsSaved] = useState(false);

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
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">{collectionName}</h2>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <div key={index}>
            <EditQuestionCard question={question}></EditQuestionCard>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={isSaved}>Save Quiz</Button>
    </div>
  );
};

export default EditQuizComponent;