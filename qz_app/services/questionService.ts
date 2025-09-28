import { Question } from "@/types/question";
import QuestionModel from "../models/QuestionModel";
import DBConnection from "@/lib/dbConfig";

export const saveQuestion = async (question: Question) => {
  await DBConnection.connect();
  const newQuestion = await QuestionModel.create(question);
  return newQuestion;
};

export const saveQuestions = async (questions: Question[]) => {
  await DBConnection.connect();
  const newQuestions = await QuestionModel.insertMany(questions);
  return newQuestions;
};

export const findQuestionById = async (id: string) => {
  await DBConnection.connect();
  const question = await QuestionModel.findOne({ id }).lean();
  return question as unknown as Question;
};

export const findQuestionsByIds = async (ids: string[]): Promise<Question[]> => {
  await DBConnection.connect();
  const questions = await QuestionModel.find({ id: { $in: ids } })
    .select("-_id id question correctAnswerID answers quizIds authorId createdAt updatedAt")
    .lean();
  return questions as unknown as Question[];
};

export const findQuestionsByQuizId = async (quizId: string): Promise<Question[]> => {
  await DBConnection.connect();
  const questions = await QuestionModel.find({ quizIds: quizId })
    .select("-_id id question correctAnswerID answers quizIds authorId createdAt updatedAt")
    .lean();
  return questions as unknown as Question[];
};

export const updateQuestion = async (questionId: string, updates: Partial<Question>) => {
  await DBConnection.connect();
  
  const updatedQuestion = await QuestionModel.findOneAndUpdate(
    { id: questionId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return updatedQuestion;
};

export const addQuizToQuestion = async (questionId: string, quizId: string) => {
  await DBConnection.connect();
  
  const question = await QuestionModel.findOneAndUpdate(
    { id: questionId },
    { $addToSet: { quizIds: quizId }, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return question;
};

export const removeQuizFromQuestion = async (questionId: string, quizId: string) => {
  await DBConnection.connect();
  
  const question = await QuestionModel.findOneAndUpdate(
    { id: questionId },
    { $pull: { quizIds: quizId }, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return question;
};

export const deleteQuestionById = async (id: string) => {
  await DBConnection.connect();
  return QuestionModel.deleteOne({ id });
};

export const deleteQuestionsByIds = async (questionIds: string[]) => {
  await DBConnection.connect();
  return QuestionModel.deleteMany({ id: { $in: questionIds } });
};
