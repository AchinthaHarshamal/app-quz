import { NextApiRequest, NextApiResponse } from "next";
import { saveQuiz as saveQuizService } from "../services/quizService";
import { saveQuestions } from "../services/questionService";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/question";

export const saveCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { quiz, questions }: { quiz: Quiz; questions: Question[] } = req.body;
    const savedQuiz = await saveQuizService(quiz);
    const savedQuestions = await saveQuestions(questions);

    res.status(201).json({ savedQuiz, savedQuestions });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
