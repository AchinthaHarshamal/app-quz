import { NextApiRequest, NextApiResponse } from "next";
import { Question } from "@/types/question";
import { Quiz } from "@/types/quiz";
import DBConnection from "../../../lib/dbConfig";
import QuestionModel from "../../../models/QuestionModel";
import QuizModel from "../../../models/QuizModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { quiz, questions }: { quiz: Quiz; questions: Question[] } = req.body;

    try {
      await DBConnection.connect();

      await QuestionModel.insertMany(questions);
      await QuizModel.create(quiz);
      
      res.status(200).json({ message: "Quiz saved successfully" });
    } catch (error) {
      console.error("Error saving quiz:", error);
      res.status(500).json({ message: "Failed to save quiz" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}