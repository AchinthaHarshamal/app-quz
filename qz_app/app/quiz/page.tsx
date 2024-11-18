"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Collection } from "../../types/collection";
import QuestionCard from "../components/QuestionCard";

export default function QuizPage() {
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

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container relative mx-auto my-4 flex gap-2">
      <div className="flex-1">
        <div className="p-4 m-2 bg-white shadow-md">
          <h2 className="text-xl font-bold">Question Title</h2>
          <p>Question content goes here...</p>
        </div>
      </div>
      <div className="flex-[4]">
        <h1 className="text-2xl font-bold m-4">{collection.topic}</h1>
        <div className="flex flex-col gap-2">
          {collection.questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}
