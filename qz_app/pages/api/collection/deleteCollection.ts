import { NextApiRequest, NextApiResponse } from "next";
import { deleteCollectionByQuizId } from "@/controllers/collectionController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    return deleteCollectionByQuizId(req, res);
  }
  res.status(405).json({ message: "Method not allowed" });
}
