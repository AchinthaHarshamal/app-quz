import { Quiz } from "@/types/quiz";
import QuizModel from "../models/QuizModel";
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

export const getQuizzesByCollection = async (collectionId: string) => {
  await DBConnection.connect();
  const quizzes = await QuizModel.find({ collectionId })
    .sort({ createdAt: -1 })
    .lean();
  return quizzes;
};

export const deleteQuizById = async (id: string) => {
  await DBConnection.connect();
  return QuizModel.deleteOne({ id });
};

export const searchQuizzes = async (query: string, page: number, pageSize: number) => {
  await DBConnection.connect();
  
  // Create a regex pattern for case-insensitive search
  const searchRegex = new RegExp(query, 'i');
  
  // Search in topic and description fields, only published quizzes
  const quizzes = await QuizModel.find({
    $and: [
      { quizState: "published" }, // Only show published quizzes
      {
        $or: [
          { topic: searchRegex },
          { description: searchRegex }
        ]
      }
    ]
  })
    .sort({ rating: -1, attempts: -1, createdAt: -1 }) // Sort by relevance
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
    
  const total = await QuizModel.countDocuments({
    $and: [
      { quizState: "published" },
      {
        $or: [
          { topic: searchRegex },
          { description: searchRegex }
        ]
      }
    ]
  });
  
  return { quizzes, total, page, pageSize };
};

export const getRecommendedQuizzes = async (userId?: string, limit: number = 6) => {
  await DBConnection.connect();
  
  // Get popular quizzes (high rating and attempts), only published ones
  const quizzes = await QuizModel.find({ quizState: "published" })
    .sort({ rating: -1, attempts: -1 })
    .limit(limit)
    .lean();
    
  return quizzes;
};

export const getUserQuizzes = async (userId: string) => {
  await DBConnection.connect();
  
  const quizzes = await QuizModel.find({ authorId: userId })
    .sort({ updatedAt: -1 })
    .lean();
    
  return quizzes;
};

export const updateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
  await DBConnection.connect();
  
  const updatedQuiz = await QuizModel.findOneAndUpdate(
    { id: quizId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return updatedQuiz;
};
