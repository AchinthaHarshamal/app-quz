'use client';
import uploadFile from "@/actions/uploadFile";
import { useState } from "react";



export default function Home() {
  const [result, setResult] = useState<any[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await uploadFile(formData);
    if (result instanceof Error) {
      console.log(result.message);
    } else {
      setResult(result);
      console.log('File uploaded successfully');
    }
  };

  return (
    <div>
      <h1>Upload file</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <button type="submit" value="Upload">Upload</button>
      </form>
      <div>
        {
          result.map((record, index) => (
            <ul key={index}>
              <h2>{record.question}</h2>
              <li>- {record.answer1}</li>
              <li>- {record.answer2}</li>
              <li>- {record.answer3}</li>
              <li>- {record.answer4}</li>
            </ul>
          ))
        }
      </div>
    </div>
  )
}
