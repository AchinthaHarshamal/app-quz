import React from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "../../types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/collection?id=${quiz.id}`);
  };

  return (
    <Card
      className="quiz-card hover:shadow-lg transition-shadow duration-300 "
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <CardHeader >
        <CardTitle>{quiz.topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="quiz-id">
          <span className="font-bold text-gray-700">Quiz ID:</span> <span className="text-gray-500">{quiz.id}</span>
        </p>
        <p className="question-count">
          <span className="font-bold text-gray-700">Number of Questions:</span> <span className="text-gray-500">{quiz.questionIds.length}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
