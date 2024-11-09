import { create } from "zustand";
import { Question } from "../../types/questions";

interface QuestionStore {
  questions: Question[];
  addQuestion: (question: Question) => void;
  removeQuestion: (question: Question) => void;
  clearQuestions: () => void;
  updateQuestion: (updatedQuestion: Question) => void;
  setQuestions: (questions: Question[]) => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  setQuestions: (newQuestions) => set({ questions: newQuestions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (question) => set((state) => ({ questions: state.questions.filter((q) => q !== question) })),
  clearQuestions: () => set({ questions: [] }),
  updateQuestion: (updatedQuestion) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
    })),
}));
