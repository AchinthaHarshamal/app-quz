import { NextApiRequest, NextApiResponse } from "next";
import { addQuizToQuestion, removeQuizFromQuestion } from "@/services/questionService";
import { findQuizById, updateQuiz } from "@/services/quizService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { questionId, quizId } = req.query;

  if (!questionId || typeof questionId !== "string") {
    return res.status(400).json({ message: "Question ID is required" });
  }

  if (!quizId || typeof quizId !== "string") {
    return res.status(400).json({ message: "Quiz ID is required" });
  }

  if (req.method === "POST") {
    try {
      // Add quiz to question
      const question = await addQuizToQuestion(questionId, quizId);
      
      // Update quiz to include question
      const currentQuiz = await findQuizById(quizId);
      if (currentQuiz && !currentQuiz.questionIds.includes(questionId)) {
        const updatedQuestionIds = [...currentQuiz.questionIds, questionId];
        await updateQuiz(quizId, { questionIds: updatedQuestionIds });
      }
      
      res.status(200).json({ 
        message: "Question added to quiz successfully",
        question
      });
    } catch (error) {
      console.error("Error adding question to quiz:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to add question to quiz", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to add question to quiz", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      // Remove quiz from question
      const question = await removeQuizFromQuestion(questionId, quizId);
      
      // Update quiz to remove question
      const currentQuiz = await findQuizById(quizId);
      if (currentQuiz) {
        const updatedQuestionIds = currentQuiz.questionIds.filter(id => id !== questionId);
        await updateQuiz(quizId, { questionIds: updatedQuestionIds });
      }
      
      res.status(200).json({ 
        message: "Question removed from quiz successfully",
        question
      });
    } catch (error) {
      console.error("Error removing question from quiz:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to remove question from quiz", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to remove question from quiz", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
