import { NextApiRequest, NextApiResponse } from "next";
import { findQuestionsByQuizId } from "@/services/questionService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { quizId } = req.query;

  if (!quizId || typeof quizId !== "string") {
    return res.status(400).json({ message: "Quiz ID is required" });
  }

  if (req.method === "GET") {
    try {
      const questions = await findQuestionsByQuizId(quizId);
      res.status(200).json({ questions });
    } catch (error) {
      console.error("Error fetching questions by quiz:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get questions", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get questions", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
