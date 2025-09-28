import { NextApiRequest, NextApiResponse } from "next";
import { getUserQuizzes } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const quizzes = await getUserQuizzes(userId);
      res.status(200).json({ quizzes });
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get user quizzes", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get user quizzes", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
