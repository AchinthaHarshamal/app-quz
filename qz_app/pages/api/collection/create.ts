import { NextApiRequest, NextApiResponse } from "next";
import { saveCollection } from "@/services/collectionService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Validate required fields
      const { name, authorId } = req.body;
      
      if (!name || !authorId) {
        return res.status(400).json({ 
          message: "Collection name and author ID are required" 
        });
      }

      // Validate name length
      if (name.length < 3 || name.length > 100) {
        return res.status(400).json({ 
          message: "Collection name must be between 3 and 100 characters" 
        });
      }

      // Validate description length if provided
      if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({ 
          message: "Description must be less than 500 characters" 
        });
      }

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
    res.status(405).json({ message: "Method not allowed" });
  }
}
