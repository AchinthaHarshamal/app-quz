import { Question } from "@/types/questions";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";

class CSVReader {
  static async readFile(file: File): Promise<Array<Question>> {
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      from_line: 1,
      quote: '"',
      escape: "\\",
      relax_quotes: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedRecords = records.map((record: any) => {
      const { problem, correctAnswer, ...answers } = record;
      return {
        id: uuidv4(),
        problem,
        correctAnswer: Number(correctAnswer),
        answers: Object.values(answers),
      };
    });
    return updatedRecords;
  }
}

export default CSVReader;
