import { NextApiRequest, NextApiResponse } from "next";
import { findCollectionById, updateCollection, deleteCollectionById } from "@/services/collectionService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collectionId } = req.query;

  if (!collectionId || typeof collectionId !== "string") {
    return res.status(400).json({ message: "Collection ID is required" });
  }

  if (req.method === "GET") {
    try {
      const collection = await findCollectionById(collectionId);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.status(200).json({ collection });
    } catch (error) {
      console.error("Error fetching collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to get collection", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to get collection", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "PATCH") {
    try {
      const updatedCollection = await updateCollection(collectionId, req.body);
      if (!updatedCollection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.status(200).json({ collection: updatedCollection });
    } catch (error) {
      console.error("Error updating collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to update collection", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to update collection", error: "An unknown error occurred" });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await deleteCollectionById(collectionId);
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
      console.error("Error deleting collection:", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Failed to delete collection", error: error.message });
      } else {
        res.status(500).json({ message: "Failed to delete collection", error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).end();
  }
}
