export interface Quiz {
  id: string;
  topic: string;
  description?: string;
  questionIds: string[];
  rating?: number;
  attempts?: number;
  quizState: "draft" | "published";
  authorId?: string;
  collectionId?: string; // Optional - quiz can exist without collection
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuizPage {
  quizzes: Quiz[];
  total: number;
  page: number;
  pageSize: number;
}
