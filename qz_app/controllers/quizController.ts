import { getQuizzes } from "@/services/quizService";
import { QuizPage } from "@/types/quiz";
import { NextApiRequest, NextApiResponse } from "next";

const getQuizPage = async (page: number, pageSize: number): Promise<QuizPage> => {
  return (await getQuizzes(page, pageSize)) as unknown as QuizPage;
};

export const handleGetQuizPage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const quizPage = await getQuizPage(Number(page), Number(pageSize));
    res.status(200).json(quizPage);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to retrieve quiz page", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve quiz page", error: "An unknown error occurred" });
    }
  }
};
