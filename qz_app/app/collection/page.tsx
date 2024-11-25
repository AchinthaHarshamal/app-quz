"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Collection } from "../../types/collection";
import QuestionCard from "../components/QuestionCard";

function QuizPageContent() {
  const [collection, setCollection] = useState<Collection | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  useEffect(() => {
    if (id) {
      fetch(`/api/collection/findByQuizId?id=${id}`)
        .then((response) => response.json())
        .then((data) => setCollection(data))
        .catch((error) => console.error("Error fetching collection:", error));
    }
  }, [id]);

  return (
    <div className="w-full relative  my-4 flex gap-2">
      <div className="flex flex-col w-full md:w-2/3 mx-auto">
        <h1 className="text-2xl font-bold m-4">{collection?.topic}</h1>
        <div className="flex flex-col mx-2 gap-2">
          {collection?.questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}