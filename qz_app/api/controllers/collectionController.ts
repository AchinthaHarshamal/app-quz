import { NextApiRequest, NextApiResponse } from "next";
import { saveQuiz as saveQuizService, findQuizById } from "../services/quizService";
import { saveQuestions, findQuestionsByIds } from "../services/questionService";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/question";
import { Collection, DeleteCollectionRequest } from "@/types/collection";
import { deleteCollection } from "../services/collectionService";

export const saveCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { quiz, questions }: { quiz: Quiz; questions: Question[] } = req.body;
    const savedQuiz = await saveQuizService(quiz);
    const savedQuestions = await saveQuestions(questions);

    res.status(201).json({ savedQuiz, savedQuestions });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).json({ message: "Failed to save collection", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to save collection", error: "An unknown error occurred" });
    }
  }
};

export const getCollectionByQuizId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const quiz: Quiz = await findQuizById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await findQuestionsByIds(quiz.questionIds);
    const collection: Collection = {
      id: quiz.id,
      topic: quiz.topic,
      questions: questions,
    };

    return res.status(200).json(collection);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Failed to retrieve collection", error: error.message });
    } else {
      return res.status(500).json({ message: "Failed to retrieve collection", error: "An unknown error occurred" });
    }
  }
};

export const deleteCollectionByQuizId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { quizId, questionIds }: DeleteCollectionRequest = req.body;
  if (!quizId || !questionIds || !Array.isArray(questionIds)) {
    return res.status(400).json({ message: "Invalid quiz ID or question IDs" });
  }

  try {
    await deleteCollection(quizId, questionIds);
    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Failed to delete collection", error: error.message });
    } else {
      return res.status(500).json({ message: "Failed to delete collection", error: "An unknown error occurred" });
    }
  }
};
