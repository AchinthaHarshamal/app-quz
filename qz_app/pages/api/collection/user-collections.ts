import { NextApiRequest, NextApiResponse } from "next";
import { getUserCollections, saveCollection } from "@/services/collectionService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const collections = await getUserCollections(userId);
      res.status(200).json({ collections });
    } catch (error) {
      console.error("Error fetching user collections:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get user collections", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get user collections", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "POST") {
    try {
      const collection = await saveCollection(req.body);
      res.status(201).json({ collection });
    } catch (error) {
      console.error("Error creating collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to create collection", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to create collection", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
