'use server';
import { writeFile } from "fs";
import { join } from "path";

async function uploadFile(data: FormData) {

    const file: File | null = data.get('file') as unknown as File;
    if (!file) {
      return new Error('No file provided');
    }
    
    const path = join('./', 'files', file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    writeFile(path, buffer, (err) => {
      if (err) {
        console.log('Error uploading file:', err);
        return new Error('Error uploading file');
      }
      console.log('File uploaded successfully');
    });
    return {success: true};
}
  
export default uploadFile ;