import { Quiz } from "@/types/quiz";
import QuizModel from "../../models/QuizModel";
import DBConnection from "@/lib/dbConfig";

export const saveQuiz = async (quiz: Quiz) => {
  await DBConnection.connect();

  const newQuiz = await QuizModel.create(quiz);
  return newQuiz;
};
