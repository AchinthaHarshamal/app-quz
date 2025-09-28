"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Eye,
  BookOpen,
  CheckCircle,
  Circle,
  CheckSquare
} from "lucide-react";
import Link from "next/link";

type QuestionType = "multiple" | "single";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  answers: Answer[];
  correctAnswerIds: string[]; // Changed to array for multiple correct answers
  explanation?: string;
}

interface QuizFormData {
  title: string;
  description: string;
  isDraft: boolean;
  collectionId: string;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
}

export default function CreateQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuizFormData>({
    title: "",
    description: "",
    isDraft: true,
    collectionId: "none",
    randomizeQuestions: false,
    randomizeAnswers: false,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [collections, setCollections] = useState<Array<{id: string, name: string}>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateId = () => `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const fetchUserCollections = useCallback(async () => {
    try {
      const response = await fetch(`/api/collection/user-collections?userId=${(session?.user as SessionUser).id}`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchUserCollections();
    }
  }, [session, fetchUserCollections]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateId(),
      type,
      text: "",
      answers: [
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
        { id: generateId(), text: "" }
      ],
      correctAnswerIds: [],
      explanation: "",
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, ...updates } : q)
    );
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const addAnswer = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.answers.length < 6) {
      const newAnswer = { id: generateId(), text: "" };
      updateQuestion(questionId, {
        answers: [...question.answers, newAnswer]
      });
    }
  };

  const removeAnswer = (questionId: string, answerId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.answers.length > 2) {
      updateQuestion(questionId, {
        answers: question.answers.filter(a => a.id !== answerId),
        correctAnswerIds: question.correctAnswerIds.filter(id => id !== answerId)
      });
    }
  };

  const updateAnswer = (questionId: string, answerId: string, text: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const updatedAnswers = question.answers.map(a => 
        a.id === answerId ? { ...a, text } : a
      );
      updateQuestion(questionId, { answers: updatedAnswers });
    }
  };

  const toggleCorrectAnswer = (questionId: string, answerId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      if (question.type === "single") {
        // Single choice: only one correct answer
        updateQuestion(questionId, {
          correctAnswerIds: question.correctAnswerIds.includes(answerId) ? [] : [answerId]
        });
      } else {
        // Multiple choice: can have multiple correct answers
        const isSelected = question.correctAnswerIds.includes(answerId);
        updateQuestion(questionId, {
          correctAnswerIds: isSelected
            ? question.correctAnswerIds.filter(id => id !== answerId)
            : [...question.correctAnswerIds, answerId]
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate quiz info
    if (!formData.title.trim()) {
      newErrors.title = "Quiz title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Quiz title must be at least 3 characters";
    }

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors[`question_${index}_text`] = "Question text is required";
      }

      if (question.correctAnswerIds.length === 0) {
        newErrors[`question_${index}_correct`] = "Please select at least one correct answer";
      }

      const emptyAnswers = question.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) {
        newErrors[`question_${index}_answers`] = "All answer options must be filled";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation functions for each step
  const validateStep1 = () => {
    return formData.title.trim().length >= 3;
  };

  const validateStep2 = () => {
    if (questions.length === 0) return false;
    
    return questions.every(question => {
      // Check if question text is filled
      if (!question.text.trim()) return false;
      
      // Check if at least one correct answer is selected
      if (question.correctAnswerIds.length === 0) return false;
      
      // Check if all answers are filled
      const emptyAnswers = question.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) return false;
      
      return true;
    });
  };

  const validateStep3 = () => {
    return validateStep1() && validateStep2();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setCurrentStep(1); // Go back to first step if validation fails
      return;
    }

    if (!session?.user || !(session.user as SessionUser).id) {
      alert("You must be signed in to create a quiz");
      return;
    }

    setIsLoading(true);

    try {
      // Create quiz data
      const quizData = {
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        topic: formData.title.trim(),
        description: formData.description.trim() || undefined,
        questionIds: questions.map(q => q.id),
        rating: 0,
        attempts: 0,
        quizState: formData.isDraft ? "draft" : "published",
        authorId: (session.user as SessionUser).id,
        collectionId: formData.collectionId === "none" ? undefined : formData.collectionId,
        randomizeQuestions: formData.randomizeQuestions,
        randomizeAnswers: formData.randomizeAnswers,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create question data
      const questionData = questions.map(question => ({
        id: question.id,
        question: question.text,
        correctAnswerID: question.correctAnswerIds[0], // For API compatibility, use first correct answer
        answerDescription: question.explanation || "",
        answers: question.answers.map(answer => ({
          id: answer.id,
          answer: answer.text
        })),
        quizIds: [quizData.id],
        authorId: (session.user as SessionUser).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Save quiz and questions
      const [quizResponse, questionsResponse] = await Promise.all([
        fetch("/api/quiz/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData),
        }),
        fetch("/api/question/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: questionData }),
        })
      ]);

      if (quizResponse.ok && questionsResponse.ok) {
        const quizResult = await quizResponse.json();
        router.push(`/quiz/${quizResult.quiz.id}`);
      } else {
        const errorData = await quizResponse.json();
        alert(`Failed to create quiz: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof QuizFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Create Quiz</h1>
          <p className="text-secondary mb-6">Please sign in to create a quiz.</p>
          <Link href="/auth/login">
            <Button className="btn-primary">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/my-dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Create Quiz</h1>
          <p className="text-secondary">Build your quiz with multiple question types</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-accent" : "text-secondary"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-accent text-white" : "bg-gray-200"}`}>
            {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
          </div>
          <span className="font-medium">Quiz Info</span>
        </div>
        <div className="flex-1 h-px bg-gray-200"></div>
        <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-accent" : "text-secondary"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-accent text-white" : "bg-gray-200"}`}>
            {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
          </div>
          <span className="font-medium">Questions</span>
        </div>
        <div className="flex-1 h-px bg-gray-200"></div>
        <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-accent" : "text-secondary"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-accent text-white" : "bg-gray-200"}`}>
            3
          </div>
          <span className="font-medium">Review</span>
        </div>
      </div>

      {/* Step 1: Quiz Information */}
      {currentStep === 1 && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Quiz Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-primary">
                Quiz Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter quiz title..."
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`input-modern ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-primary">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this quiz is about..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="input-modern resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">
                Collection
              </Label>
              <select
                value={formData.collectionId}
                onChange={(e) => handleInputChange("collectionId", e.target.value)}
                className="input-modern w-full"
              >
                <option value="none">No Collection (Default)</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-secondary">
                Select a collection to organize your quiz, or leave as &quot;No Collection&quot;
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">
                Randomization Options
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="randomizeQuestions"
                    checked={formData.randomizeQuestions}
                    onCheckedChange={(checked) => handleInputChange("randomizeQuestions", checked as boolean)}
                  />
                  <Label htmlFor="randomizeQuestions" className="text-sm text-secondary cursor-pointer">
                    Randomize question order
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="randomizeAnswers"
                    checked={formData.randomizeAnswers}
                    onCheckedChange={(checked) => handleInputChange("randomizeAnswers", checked as boolean)}
                  />
                  <Label htmlFor="randomizeAnswers" className="text-sm text-secondary cursor-pointer">
                    Randomize answer order
                  </Label>
                </div>
              </div>
              <p className="text-xs text-secondary">
                Randomization makes each quiz attempt unique by shuffling questions and/or answers
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">
                Save as Draft
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDraft"
                  checked={formData.isDraft}
                  onCheckedChange={(checked) => handleInputChange("isDraft", checked as boolean)}
                />
                <Label htmlFor="isDraft" className="text-sm text-secondary cursor-pointer">
                  Save as draft (you can publish later)
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!validateStep1()}
                className="btn-primary flex-1"
              >
                Next: Add Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Questions */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Questions List */}
          {questions.map((question, index) => (
            <Card key={question.id} className="card-modern">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Question {index + 1} - {question.type === "multiple" ? "Multiple Choice" : "Single Choice"}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">Question Text *</Label>
                  <Textarea
                    placeholder="Enter your question..."
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                    className={`input-modern resize-none ${errors[`question_${index}_text`] ? "border-red-500" : ""}`}
                    rows={3}
                  />
                  {errors[`question_${index}_text`] && (
                    <p className="text-sm text-red-600">{errors[`question_${index}_text`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">Answer Options *</Label>
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answer.id} className="flex items-center gap-2">
                      {question.type === "multiple" ? (
                        <input
                          type="checkbox"
                          checked={question.correctAnswerIds.includes(answer.id)}
                          onChange={() => toggleCorrectAnswer(question.id, answer.id)}
                          className="text-accent"
                        />
                      ) : (
                        <input
                          type="radio"
                          name={`correct_${question.id}`}
                          checked={question.correctAnswerIds.includes(answer.id)}
                          onChange={() => toggleCorrectAnswer(question.id, answer.id)}
                          className="text-accent"
                        />
                      )}
                      <Input
                        value={answer.text}
                        onChange={(e) => updateAnswer(question.id, answer.id, e.target.value)}
                        placeholder={`Option ${answerIndex + 1}`}
                        className={`flex-1 ${errors[`question_${index}_answers`] ? "border-red-500" : ""}`}
                      />
                      {question.answers.length > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAnswer(question.id, answer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {question.answers.length < 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAnswer(question.id)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </Button>
                  )}
                  {errors[`question_${index}_answers`] && (
                    <p className="text-sm text-red-600">{errors[`question_${index}_answers`]}</p>
                  )}
                  {errors[`question_${index}_correct`] && (
                    <p className="text-sm text-red-600">{errors[`question_${index}_correct`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">Explanation (Optional)</Label>
                  <Textarea
                    placeholder="Explain why this answer is correct..."
                    value={question.explanation || ""}
                    onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                    className="input-modern resize-none"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {questions.length === 0 && (
            <Card className="card-modern">
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No questions yet</h3>
                <p className="text-secondary mb-6">Add your first question to get started!</p>
              </CardContent>
            </Card>
          )}

          {/* Add Question Buttons - Always at bottom */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                Add Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => addQuestion("multiple")}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 hover:bg-accent/10 hover:border-accent transition-all duration-300"
                >
                  <CheckSquare className="w-6 h-6" />
                  <span>Multiple Choice</span>
                </Button>
                <Button
                  onClick={() => addQuestion("single")}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 hover:bg-accent/10 hover:border-accent transition-all duration-300"
                >
                  <Circle className="w-6 h-6" />
                  <span>Single Choice</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {errors.questions && (
            <div className="text-center">
              <p className="text-sm text-red-600">{errors.questions}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1"
            >
              Back: Quiz Info
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!validateStep2()}
              className="btn-primary flex-1"
            >
              Next: Review Quiz
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                Review Your Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">Quiz Title</h3>
                <p className="text-secondary">{formData.title}</p>
              </div>
              {formData.description && (
                <div>
                  <h3 className="font-semibold text-primary mb-2">Description</h3>
                  <p className="text-secondary">{formData.description}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-primary mb-2">Questions ({questions.length})</h3>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-3">
                      <p className="font-medium text-primary mb-2">
                        {index + 1}. {question.text}
                      </p>
                      <div className="space-y-1">
                        {question.answers.map((answer) => (
                          <div
                            key={answer.id}
                            className={`text-sm ${
                              question.correctAnswerIds.includes(answer.id)
                                ? "text-green-600 font-medium"
                                : "text-secondary"
                            }`}
                          >
                            {question.correctAnswerIds.includes(answer.id) ? "✓ " : "• "}
                            {answer.text}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className="text-xs text-secondary mt-2 italic">
                          Explanation: {question.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="flex-1"
            >
              Back: Edit Questions
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !validateStep3()}
              className="btn-primary flex-1 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {formData.isDraft ? "Save as Draft" : "Publish Quiz"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
