export interface Answer {
  id: string;
  answer: string;
}

export interface Question {
  id: string;
  question: string;
  correctAnswerID: string;
  answers: Answer[];
}
