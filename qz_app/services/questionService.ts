import { Question } from "@/types/question";
import QuestionModel from "../models/QuestionModel";
import DBConnection from "@/lib/dbConfig";

export const saveQuestions = async (questions: Question[]) => {
  await DBConnection.connect();
  const newQuestions = await QuestionModel.insertMany(questions);
  return newQuestions;
};

export const findQuestionsByIds = async (ids: string[]): Promise<Question[]> => {
  await DBConnection.connect();
  const questions = await QuestionModel.find({ id: { $in: ids } })
    .select("-_id id question correctAnswerID answers")
    .lean();
  return questions as unknown as Question[];
};

export const deleteQuestionsByIds = async (questionIds: string[]) => {
  await DBConnection.connect();
  return QuestionModel.deleteMany({ id: { $in: questionIds } });
};
