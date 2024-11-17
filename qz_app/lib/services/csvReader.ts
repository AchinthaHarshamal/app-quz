import { Collection } from "@/types/collection";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";
class CSVReader {
 
  static async getCollection(file: File): Promise<Collection> {
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      from_line: 2,
      quote: '"',
      escape: "\\",
      relax_quotes: true,
    });

    const collectionTopic = text.split("\n")[0].trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedRecords = records.map((record: any) => {
      const { question, correctAnswer, ...answers } = record;
      const answerEntries = Object.entries(answers).map(([, answer]) => ({
        id: uuidv4(),
        answer,
      }));

      return {
        id: uuidv4(),
        question: question,
        correctAnswerID: answerEntries[Number(correctAnswer)].id,
        answers: answerEntries,
      };
    });

    return {
      id : uuidv4(),
      topic: collectionTopic,
      questions: updatedRecords,
    };
  }
}

export default CSVReader;
