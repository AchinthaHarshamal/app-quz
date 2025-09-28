import { NextApiRequest, NextApiResponse } from "next";
import { saveQuestions } from "@/services/questionService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Validate required fields
      const { questions } = req.body;
      
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ 
          message: "Questions array is required and must not be empty" 
        });
      }

      // Validate each question
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        
        if (!question.id || !question.question || !question.correctAnswerID) {
          return res.status(400).json({ 
            message: `Question ${i + 1}: ID, question text, and correct answer ID are required` 
          });
        }

        if (!question.answers || !Array.isArray(question.answers) || question.answers.length < 2) {
          return res.status(400).json({ 
            message: `Question ${i + 1}: At least 2 answers are required` 
          });
        }

        if (!question.quizIds || !Array.isArray(question.quizIds) || question.quizIds.length === 0) {
          return res.status(400).json({ 
            message: `Question ${i + 1}: Must belong to at least one quiz` 
          });
        }

        // Validate answers
        for (let j = 0; j < question.answers.length; j++) {
          const answer = question.answers[j];
          if (!answer.id || !answer.answer) {
            return res.status(400).json({ 
              message: `Question ${i + 1}, Answer ${j + 1}: ID and text are required` 
            });
          }
        }
      }

      const savedQuestions = await saveQuestions(questions);
      res.status(201).json({ questions: savedQuestions });
    } catch (error) {
      console.error("Error creating questions:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to create questions", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to create questions", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
