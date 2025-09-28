import { NextApiRequest, NextApiResponse } from "next";
import { getRecommendedQuizzes } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { limit = 6 } = req.query;
    
    try {
      const quizzes = await getRecommendedQuizzes(undefined, Number(limit));
      res.status(200).json({ quizzes });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get recommended quizzes", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get recommended quizzes", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
