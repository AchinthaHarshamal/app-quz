import { NextApiRequest, NextApiResponse } from "next";
import { saveQuiz } from "@/services/quizService";
import { addQuizToCollection } from "@/services/collectionService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Validate required fields
      const { topic, authorId, collectionId } = req.body;
      
      if (!topic || !authorId) {
        return res.status(400).json({ 
          message: "Quiz title and author ID are required" 
        });
      }

      // Validate title length
      if (topic.length < 3 || topic.length > 100) {
        return res.status(400).json({ 
          message: "Quiz title must be between 3 and 100 characters" 
        });
      }

      // Validate description length if provided
      if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({ 
          message: "Description must be less than 500 characters" 
        });
      }

      const quiz = await saveQuiz(req.body);
      
      // If quiz has a collectionId, add it to the collection
      if (collectionId && collectionId !== "none") {
        try {
          await addQuizToCollection(collectionId, quiz.id);
        } catch (collectionError) {
          console.error("Error adding quiz to collection:", collectionError);
          // Don't fail the quiz creation if collection update fails
        }
      }
      
      res.status(201).json({ quiz });
    } catch (error) {
      console.error("Error creating quiz:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to create quiz", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to create quiz", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
