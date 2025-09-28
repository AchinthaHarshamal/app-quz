import { NextApiRequest, NextApiResponse } from "next";
import { getQuizzesByCollection } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collectionId } = req.query;

  if (!collectionId || typeof collectionId !== "string") {
    return res.status(400).json({ message: "Collection ID is required" });
  }

  if (req.method === "GET") {
    try {
      const quizzes = await getQuizzesByCollection(collectionId);
      res.status(200).json({ quizzes });
    } catch (error) {
      console.error("Error fetching quizzes by collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get quizzes", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get quizzes", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
