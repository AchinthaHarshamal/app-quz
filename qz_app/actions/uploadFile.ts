"use server";
import CSVReader from "@/lib/services/csvReader";
import { Quiz } from "@/types/questions";

async function uploadFile(data: FormData): Promise<Quiz> {
  const file: File | null = data.get("file") as unknown as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const result = await CSVReader.readFile(file);
  return result;
}

export default uploadFile;
