"use server";
import CSVReader from "@/lib/services/csvReader";
import { Collection } from "@/types/collection";

async function uploadFile(data: FormData): Promise<Collection> {
  const file: File | null = data.get("file") as unknown as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const result: Collection = await CSVReader.getCollection(file);
  return result;
}

export default uploadFile;
