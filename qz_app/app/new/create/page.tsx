"use client";
import { useQuizStore } from "../../store/useQuestionStore";
import EditQuizComponent from "../../components/EditQuizComponent";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CreateQuiz() {
  const { quiz, setQuiz } = useQuizStore((state) => ({
    quiz: state.quiz,
    setQuiz: state.setQuiz,
  }));

  // Initialize quiz if it doesn't exist
  useEffect(() => {
    if (!quiz || !quiz.id) {
      const newQuiz = {
        id: uuidv4(),
        topic: "New Quiz",
        description: "",
        questionIds: [],
      };
      setQuiz(newQuiz);
    }
  }, [quiz, setQuiz]);

  return (
    <div className="container relative mx-auto my-4 flex flex-col items-start gap-2">
      {quiz && (
        <section className="mx-auto px-4 sm:my-8 w-full md:w-4/5">
          <EditQuizComponent collectionName={quiz.topic} />
        </section>
      )}
    </div>
  );
}
