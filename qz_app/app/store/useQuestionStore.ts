import { create } from "zustand";
import { Question } from "../../types/questions";

interface QuestionStore {
  questions: Question[];
  addQuestion: (question: Question) => void;
  removeQuestion: (question: Question) => void;
  clearQuestions: () => void;
  updateQuestion: (updatedQuestion: Question) => void;
  setQuestions: (questions: Question[]) => void;
  getQuestions: () => Question[];
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  questions: [],
  setQuestions: (newQuestions) => set({ questions: newQuestions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (question) => set((state) => ({ questions: state.questions.filter((q) => q !== question) })),
  clearQuestions: () => set({ questions: [] }),
  updateQuestion: (updatedQuestion) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
    })),
  getQuestions: () => get().questions,
}));

interface Quiz {
  id: string;
  name: string;
  questionIds: string[];
}

interface QuizStore {
  quiz: Quiz | null;
  setQuiz: (quiz: Quiz) => void;
  clearQuiz: () => void;
  updateQuiz: (updatedQuiz: Quiz) => void;
  getQuiz: () => Quiz | null;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quiz: null,
  setQuiz: (quiz) => set({ quiz }),
  clearQuiz: () => set({ quiz: null }),
  updateQuiz: (updatedQuiz) =>
    set((state) => ({
      quiz: state.quiz && state.quiz.id === updatedQuiz.id ? updatedQuiz : state.quiz,
    })),
  getQuiz: () => get().quiz
}));
