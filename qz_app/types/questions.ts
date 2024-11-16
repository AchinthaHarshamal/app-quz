export interface Answer {
  id: string;
  answer: string;
}

export interface Question {
  id: string;
  problem: string;
  correctAnswerID: string;
  answers: Answer[];
}

export interface QuizWithQuestions {
  id: string;
  collectionName: string;
  questions: Question[];
}

export interface Quiz {
  id: string;
  name: string;
  questionIds: string[];
}
