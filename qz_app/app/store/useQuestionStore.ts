import { create } from "zustand";
import { Question } from "@/types/question";
import { Quiz } from "@/types/quiz";

interface QuestionStore {
  questions: Question[];
  addQuestion: (question: Question) => void;
  removeQuestion: (question: Question) => void;
  clearQuestions: () => void;
  updateQuestion: (updatedQuestion: Question) => void;
  setQuestions: (questions: Question[]) => void;
  getQuestions: () => Question[];
  reset: () => void;
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  questions: [],
  setQuestions: (newQuestions) => set({ questions: newQuestions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (question) => set((state) => ({ questions: state.questions.filter((q) => q !== question) })),
  clearQuestions: () => set({ questions: [] }),
  updateQuestion: (updatedQuestion) =>
    set((state) => {
      const existingQuestionIndex = state.questions.findIndex((q) => q.id === updatedQuestion.id);
      if (existingQuestionIndex !== -1) {
        return {
          questions: state.questions.map((q, index) => (index === existingQuestionIndex ? updatedQuestion : q)),
        };
      } else {
        return {
          questions: [...state.questions, updatedQuestion],
        };
      }
    }),
  getQuestions: () => get().questions,
  reset: () => set({ questions: [] }),
}));

interface QuizStore {
  quiz: Quiz;
  setQuiz: (quiz: Quiz) => void;
  clearQuiz: () => void;
  updateQuiz: (updatedQuiz: Quiz) => void;
  getQuiz: () => Quiz;
  reset: () => void;
  addQuestionId: (questionId: string) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quiz: {} as Quiz,
  setQuiz: (quiz) => set({ quiz }),
  clearQuiz: () => set({ quiz: {} as Quiz }),
  updateQuiz: (updatedQuiz) =>
    set((state) => ({
      quiz: state.quiz && state.quiz.id === updatedQuiz.id ? updatedQuiz : state.quiz,
    })),
  getQuiz: () => get().quiz,
  reset: () => set({ quiz: {} as Quiz }),
  addQuestionId: (questionId) =>
    set((state) => ({
      quiz: {
        ...state.quiz,
        questionIds: state.quiz.questionIds?.includes(questionId)
          ? state.quiz.questionIds
          : [...(state.quiz.questionIds || []), questionId],
      },
    })),
}));
