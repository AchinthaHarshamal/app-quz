"use server";
import CSVReader from "@/lib/services/csvReader";

async function uploadFile(data: FormData) {
  const file: File | null = data.get("file") as unknown as File;
  if (!file) {
    return new Error("No file provided");
  }

  const result = await CSVReader.readFile(file);
  return result;
}

export default uploadFile;
