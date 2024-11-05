"use client";
import uploadFile from "@/actions/uploadFile";
import { useState } from "react";
import QuizCard from "./components/quizCard";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [result, setResult] = useState<Question[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

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
    <div className="container relative mx-auto my-4 flex flex-col items-start gap-2">
      <section className="mx-auto px-4 w-full md:w-2/3 lg:w-1/2">
        <div className="rounded-lg border bg-background shadow p-4 flex flex-col gap-2 items-center">
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 align">
            <input type="file" name="file" id="fileInput" className="hidden" onChange={handleFileChange} />
            <label htmlFor="fileInput" className="w-full cursor-pointer bg-blue-500 text-white py-2 px-4 rounded">
              Browse file
            </label>
            {fileName && <p className="text-gray-500 mt-2">{fileName}</p>}
            {fileName && <Button type="submit" value="Upload" className="">
              Upload
            </Button>}
          </form>
        </div>
      </section>

      <section className="mx-auto px-4 w-full md:w-4/5">
        <div className="flex flex-col gap-2">
          {result.map((question, index) => (
            <div key={index}>
              <QuizCard question={question}></QuizCard>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
