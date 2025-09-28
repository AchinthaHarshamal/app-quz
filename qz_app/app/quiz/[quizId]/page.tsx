"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/question";
import { 
  ArrowLeft, 
  Edit, 
  Eye,
  Star,
  Users,
  BookOpen,
  Share2,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function QuizViewPage() {
  const params = useParams();
  const quizId = params?.quizId as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch quiz details
      const quizResponse = await fetch(`/api/quiz/${quizId}`);
      if (!quizResponse.ok) {
        throw new Error("Quiz not found");
      }
      const quizData = await quizResponse.json();
      setQuiz(quizData);

      // Fetch questions for this quiz
      const questionsResponse = await fetch(`/api/question/by-quiz/${quizId}`);
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData.questions || []);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError(error instanceof Error ? error.message : "Failed to load quiz");
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId, fetchQuizData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Quiz Not Found</h1>
          <p className="text-secondary mb-6">
            {error || "The quiz you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it."}
          </p>
          <Link href="/my-dashboard">
            <Button className="btn-primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/my-dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-accent" />
              {quiz.topic}
            </h1>
            {quiz.description && (
              <p className="text-secondary mt-1">{quiz.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/quiz/${quiz.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Quiz
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Quiz Info */}
      <Card className="card-modern mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="font-medium">{questions.length} questions</span>
            </div>
            {quiz.rating !== undefined && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#CAF0F8] text-[#CAF0F8]" />
                <span className="font-medium">{quiz.rating.toFixed(1)} rating</span>
              </div>
            )}
            {quiz.attempts !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span className="font-medium">{quiz.attempts} attempts</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="font-medium">
                {quiz.quizState === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Created {new Date(quiz.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Preview */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Questions Preview</h2>
        
        {questions.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No questions yet</h3>
              <p className="text-secondary mb-6">
                This quiz doesn&apos;t have any questions yet.
              </p>
              <Link href={`/quiz/${quiz.id}/edit`}>
                <Button className="btn-primary">Add Questions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="card-modern">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-medium text-primary">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.answers.map((answer, answerIndex) => (
                      <div
                        key={answer.id}
                        className={`p-2 rounded border ${
                          answer.id === question.correctAnswerID
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {answer.id === question.correctAnswerID ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                          )}
                          <span className="font-medium">
                            {String.fromCharCode(65 + answerIndex)}. {answer.answer}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {question.answerDescription && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.answerDescription}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href={`/quiz/${quiz.id}/edit`} className="flex-1">
          <Button className="btn-primary w-full flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Quiz
          </Button>
        </Link>
        <Button variant="outline" className="flex-1 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview Quiz
        </Button>
      </div>
    </div>
  );
}
