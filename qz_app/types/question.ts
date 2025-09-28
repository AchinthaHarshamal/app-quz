export interface Answer {
  id: string;
  answer: string;
}

export interface Question {
  id: string;
  question: string;
  correctAnswerID: string;
  answerDescription?: string;
  answers: Answer[];
  quizIds: string[]; // Required - question must belong to at least one quiz
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
