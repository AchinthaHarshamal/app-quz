"use client";
import { useEffect, useState } from "react";
import { MyPagination } from "../components/PaginationComponent";
import { Quiz, QuizPage } from "../../types/quiz";
import QuizCard from "../components/QuizCard";
import { QuizListSkeleton } from "../components/skeletons/quizPage";

const fetchQuizPage = async (page: number, pageSize: number): Promise<QuizPage> => {
  const res = await fetch(`/api/quiz/getQuizPage?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) {
    throw new Error("Failed to fetch quiz page");
  }
  return res.json();
};

export default function AllQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 8;

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      try {
        const data = await fetchQuizPage(page, pageSize);
        setQuizzes(data.quizzes);
        setTotal(data.total);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [page]);

  return (
    <div className="container relative mx-auto my-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold m-4">All Quizzes</h1>
      {loading ? (
        <QuizListSkeleton />
      ) : (
        <div className="flex flex-col gap-2">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
      <MyPagination totalCount={total} pageSize={pageSize} setPageNumber={setPage} />
    </div>
  );
}
