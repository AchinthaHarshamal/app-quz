
import { NextApiRequest, NextApiResponse } from "next";
import { Quiz, Question } from "@/types/questions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { quiz, questions }: { quiz: Quiz; questions: Question[] } = req.body;

    try {
      // Save the quiz and questions to the database
      // Example: await saveQuizToDatabase(quiz, questions);
      console.log(quiz, questions);
      
      res.status(200).json({ message: "Quiz saved successfully" });
    } catch (error) {
      console.error("Error saving quiz:", error);
      res.status(500).json({ message: "Failed to save quiz" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}