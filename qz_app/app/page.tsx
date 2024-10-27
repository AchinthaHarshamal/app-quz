"use client";
import uploadFile from "@/actions/uploadFile";
import { useState } from "react";
import QuizCard from "./compenents/quizCard";
import { Question } from "@/types/questions";

export default function Home() {
  const [result, setResult] = useState<Question[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await uploadFile(formData);
    if (result instanceof Error) {
      console.log(result.message);
    } else {
      setResult(result);
      console.log("File uploaded successfully");
    }
  };

  return (
    <div>
      <h1>Upload file</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <button type="submit" value="Upload">
          Upload
        </button>
      </form>
      <div>
        {result.map((question, index) => (
          <div key={index}>
            <QuizCard question={question}></QuizCard>
          </div>
        ))}
      </div>
    </div>
  );
}
