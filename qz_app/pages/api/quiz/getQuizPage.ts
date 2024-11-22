import { NextApiRequest, NextApiResponse } from "next";
import { handleGetQuizPage } from "@/api/controllers/quizController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetQuizPage(req, res);
  } else {
    res.status(405).end();
  }
}
