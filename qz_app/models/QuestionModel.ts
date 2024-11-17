import { Answer } from "@/types/question";
import mongoose, { Schema, Document } from "mongoose";

interface IQuestion extends Document {
  id: string;
  question: string;
  correctAnswerID: string;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  id: { type: String, required: true },
  answer: { type: String, required: true },
});

const QuestionSchema: Schema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  correctAnswerID: { type: String, required: true },
  answers: { type: [AnswerSchema], required: true, _id: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QuestionModel = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default QuestionModel;
