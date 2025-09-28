import { NextApiRequest, NextApiResponse } from "next";
import { findQuizById, updateQuiz, deleteQuizById } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { quizId } = req.query;

  if (!quizId || typeof quizId !== "string") {
    return res.status(400).json({ message: "Quiz ID is required" });
  }

  if (req.method === "GET") {
    try {
      const quiz = await findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.status(200).json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get quiz", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get quiz", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "PATCH") {
    try {
      const updates = req.body;
      const updatedQuiz = await updateQuiz(quizId, updates);
      res.status(200).json(updatedQuiz);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to update quiz", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to update quiz", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      await deleteQuizById(quizId);
      res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to delete quiz", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to delete quiz", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
