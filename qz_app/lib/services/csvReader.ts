import { parse } from 'csv-parse/sync';

class CSVReader {
    static async readFile(file: File): Promise<Array<{ question: string, correctAnswer: string, answer1: string, answer2: string, answer3: string, answer4: string }>> {
        const text = await file.text();
        const records = parse(text, {
            columns: ['question', 'correctAnswer', 'answer1', 'answer2', 'answer3', 'answer4'],
            skip_empty_lines: true,
            from_line: 2,
            quote: '"',
            escape: '\\',
            relax_quotes: true
        });
        
        return records;
    }
}

export default CSVReader;
