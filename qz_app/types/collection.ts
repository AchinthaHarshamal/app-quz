import { Question } from "./question";

export interface Collection {
  id: string;
  topic: string;
  questions: Question[];
}
