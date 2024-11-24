"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomCardProps {
  readonly url: string;
  readonly css: string;
  readonly title: string;
  readonly content: string;
}

function CustomCard({ url, css, title, content }: CustomCardProps) {
  return (
    <Link href={url}>
      <Card className={`flex flex-col w-full sm:w-60 h-60 item-center justify-center shadow-lg ${css}`}>
        <CardHeader className="items-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <p className="text-center">{content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="container relative mx-auto flex flex-col items-center justify-center min-h-screen gap-2">
      <h1 className="text-2xl text-center sm:text-4xl py-6">Welcome to the Quiz App</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 px-2 gap-4">
        <CustomCard
          url="/new/upload-csv"
          css="shadow-blue-500/50"
          title="Upload new Quiz"
          content="Upload your quiz data as CSV"
        />
        <CustomCard
          url="/quiz"
          css="shadow-green-500/50"
          title="View Quizzes"
          content="See all quizzes"
        />
      </div>
    </div>
  );
}
