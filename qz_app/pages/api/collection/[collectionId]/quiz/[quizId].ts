import { NextApiRequest, NextApiResponse } from "next";
import { addQuizToCollection, removeQuizFromCollection } from "@/services/collectionService";
import { updateQuiz } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collectionId, quizId } = req.query;

  if (!collectionId || typeof collectionId !== "string") {
    return res.status(400).json({ message: "Collection ID is required" });
  }

  if (!quizId || typeof quizId !== "string") {
    return res.status(400).json({ message: "Quiz ID is required" });
  }

  if (req.method === "POST") {
    try {
      // Add quiz to collection
      const collection = await addQuizToCollection(collectionId, quizId);
      
      // Update quiz to reference collection
      await updateQuiz(quizId, { collectionId });
      
      res.status(200).json({ 
        message: "Quiz added to collection successfully",
        collection 
      });
    } catch (error) {
      console.error("Error adding quiz to collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to add quiz to collection", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to add quiz to collection", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      // Remove quiz from collection
      const collection = await removeQuizFromCollection(collectionId, quizId);
      
      // Update quiz to remove collection reference
      await updateQuiz(quizId, { collectionId: undefined });
      
      res.status(200).json({ 
        message: "Quiz removed from collection successfully",
        collection 
      });
    } catch (error) {
      console.error("Error removing quiz from collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to remove quiz from collection", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to remove quiz from collection", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
