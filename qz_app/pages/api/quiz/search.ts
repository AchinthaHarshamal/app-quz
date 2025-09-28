import { NextApiRequest, NextApiResponse } from "next";
import { searchQuizzes } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { q: query, page = 1, pageSize = 10 } = req.query;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Search query is required" });
    }

    try {
      const results = await searchQuizzes(query, Number(page), Number(pageSize));
      res.status(200).json(results);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to search quizzes", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to search quizzes", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
