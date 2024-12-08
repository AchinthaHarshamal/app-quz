import { NextApiRequest, NextApiResponse } from "next";
import DBConnection from "../../lib/dbConfig";
import Question_ from "@/models/QuestionModel";
import User from "@/models/UserModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await DBConnection.connect();
  const user = await User.findOne({ email: "achi@gmail.com" });

  // return user objet if found
  if (user) {
    return res.status(200).json(user);
  }
  // const newQuestion = new Question_({
  //   id: "1123",
  //   problem: "What is MongoDB?",
  //   correctAnswerID: "1",
  //   answers: [
  //     { id: "1", answer: "A NoSQL database" },
  //     { id: "2", answer: "A relational database" },
  //     { id: "3", answer: "A programming language" },
  //     { id: "4", answer: "A web framework" }
  //   ]
  // });

  // // Save the question object to the database
  // newQuestion
  //   .save()
  //   .then(() => {
  //     console.log("Question saved successfully!");
  //   })
  //   .catch((error: unknown) => {
  //     console.error("Error saving question:", error);
  //   });
  if (!connection) {
    return res.status(500).json({ error: "Failed to connect to the database" });
  }
  res.status(200).json("Connection successful");
}
