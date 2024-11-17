import { Question } from "@/types/question";
import QuestionModel from "../../models/QuestionModel";
import DBConnection from "@/lib/dbConfig";

export const saveQuestions = async (questions: Question[]) => {
  await DBConnection.connect();
  const newQuestions = await QuestionModel.insertMany(questions);
  return newQuestions;
};
