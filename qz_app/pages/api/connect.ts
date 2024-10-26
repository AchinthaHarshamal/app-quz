import { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "../../lib/dbConfig";
import Question from "@/models/QuestionModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await DBConnection.connect();
  
  const newQuestion = new Question({
    title: "What is MongoDB?",
    body: "Can someone explain what MongoDB is and how it works?",
    tags: ["database", "mongodb", "nosql"],
  });

  // Save the question object to the database
  newQuestion
    .save()
    .then(() => {
      console.log("Question saved successfully!");
    })
    .catch((error: unknown) => {
      console.error("Error saving question:", error);
    });
  if (!connection) {
    return res.status(500).json({ error: "Failed to connect to the database" });
  }
  res.status(200).json("Connection successful");
}
