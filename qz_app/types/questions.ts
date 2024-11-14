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

export interface Quiz {
  id: string;
  collectionName: string;
  questions: Question[];
}
