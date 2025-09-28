import { Collection } from "@/types/collection";
import { v4 as uuidv4 } from "uuid";
class CSVReader {
 
  static async getCollection(file: File): Promise<Collection> {
    const text = await file.text();
    
    const collectionTopic = text.split("\n")[0].trim();

    return {
      id: uuidv4(),
      name: collectionTopic,
      description: `Collection created from CSV: ${collectionTopic}`,
      authorId: "", // Will be set when saving
      quizIds: [], // Will be populated when quizzes are created
      isPublic: true,
    };
  }
}

export default CSVReader;
