import { Question } from "@/types/questions";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";

interface QuestionCollection {
  id: string;
  collectionName: string;
  questions: Question[];
}

class CSVReader {
 
  static async readFile(file: File): Promise<QuestionCollection> {
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      from_line: 2,
      quote: '"',
      escape: "\\",
      relax_quotes: true,
    });

    const collectionName = text.split("\n")[0].trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedRecords = records.map((record: any) => {
      const { problem, correctAnswer, ...answers } = record;
      const answerEntries = Object.entries(answers).map(([, answer]) => ({
        id: uuidv4(),
        answer,
      }));

      return {
        id: uuidv4(),
        problem,
        correctAnswerID: answerEntries[Number(correctAnswer)].id,
        answers: answerEntries,
      };
    });

    return {
      id : uuidv4(),
      collectionName,
      questions: updatedRecords,
    };
  }
}

export default CSVReader;
