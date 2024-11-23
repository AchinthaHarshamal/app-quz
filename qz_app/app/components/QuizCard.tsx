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
    <Card className="quiz-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <CardHeader>
        <CardTitle>{quiz.topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Quiz ID: {quiz.id}</p>
        <p>Number of Questions: {quiz.questionIds.length}</p>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
