import { NextApiRequest, NextApiResponse } from "next";
import { saveCollection } from "@/controllers/collectionController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return saveCollection(req, res);
  }
  res.status(405).json({ message: "Method not allowed" });
}
