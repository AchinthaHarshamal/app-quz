export interface Collection {
  id: string;
  name: string;
  description?: string;
  authorId: string;
  quizIds: string[];
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Question {
  id: string;
  question: string;
  correctAnswerID: string;
  answerDescription: string;
  answers: Answer[];
  quizIds: string[]; // Required - question must belong to at least one quiz
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Answer {
  id: string;
  answer: string;
}

// Existing interfaces
export interface QuizPage {
  quizzes: Quiz[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CollectionPage {
  collections: Collection[];
  total: number;
  page: number;
  pageSize: number;
}
