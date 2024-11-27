"use client";
import { useQuestionStore, useQuizStore } from "../../store/useQuestionStore";
import EditQuizComponent from "../../components/EditQuizComponent";

export default function CreateQuiz() {
  const { questions } = useQuestionStore((state) => ({
    questions: state.questions,
  }));
  const { quiz } = useQuizStore((state) => ({
    quiz: state.quiz,
  }));

  return (
    <div className="container relative mx-auto my-4 flex flex-col items-start gap-2">
      {quiz && (
        <section className="mx-auto px-4 sm:my-8 w-full md:w-4/5">
          <EditQuizComponent collectionName={quiz.topic} questions={questions} />
        </section>
      )}
    </div>
  );
}
