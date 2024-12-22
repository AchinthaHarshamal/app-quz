import { NextApiRequest, NextApiResponse } from "next";
import { getCollectionByQuizId } from "@/controllers/collectionController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getCollectionByQuizId(req, res);
  }
  res.status(405).json({ message: "Method not allowed" });
}
