export interface Quiz {
  id: string;
  topic: string;
  questionIds: string[];
}

export interface QuizPage {
  quizzes: Quiz[];
  total: number;
  page: number;
  pageSize: number;
}
