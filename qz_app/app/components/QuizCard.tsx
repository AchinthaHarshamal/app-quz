import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "../../types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Share2 } from "lucide-react";
import { deleteCollection } from "../../lib/services/apiClient";
import ShareDialogButton from "./shareDialog";

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false);

  const handleClick = () => {
    router.push(`/collection?id=${quiz.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteCollection(quiz.id, quiz.questionIds);
      setIsDeleted(true);
    } catch (error) {
      console.error("Failed to delete collection", error);
    }
  };

  if (isDeleted) return null;

  return (
    <Card className="quiz-card hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardHeader className="pb-0" onClick={handleClick}>
        <CardTitle className="p-0 m-0">{quiz.topic}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="question-count">
          <span className="font-bold text-gray-800">Number of Questions:</span>{" "}
          <span className="text-gray-700">{quiz.questionIds.length}</span>
        </p>
        <div className="flex justify-between">
          <span className="text-gray-300">{quiz.id}</span>
          <div className="flex gap-4">
            <ShareDialogButton
              title="Share this Quiz"
              description="Copy the link below to share this quiz."
              link={`${window.location.origin}/collection?id=${quiz.id}`}
              button={<Share2 />}
            />
            <X className="text-red-600 cursor-pointer text-xl" onClick={handleDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
