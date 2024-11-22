import { Quiz } from "@/types/quiz";
import QuizModel from "../../models/QuizModel";
import DBConnection from "@/lib/dbConfig";

export const saveQuiz = async (quiz: Quiz) => {
  await DBConnection.connect();

  const newQuiz = await QuizModel.create(quiz);
  return newQuiz;
};

export const findQuizById = async (id: string) => {
  await DBConnection.connect();
  const quiz = await QuizModel.findOne({ id }).lean();
  return quiz as unknown as Quiz;
};

export const getQuizzes = async (page: number, pageSize: number) => {
  await DBConnection.connect();
  const quizzes = await QuizModel.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  const total = await QuizModel.countDocuments();
  return { quizzes, total, page, pageSize };
};
