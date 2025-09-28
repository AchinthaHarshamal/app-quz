import { Answer } from "@/types/question";
import mongoose, { Schema, Document } from "mongoose";

interface IQuestion extends Document {
  id: string;
  question: string;
  correctAnswerID: string;
  answerDescription: string;
  answers: Answer[];
  quizIds: string[]; // Required - question must belong to at least one quiz
  authorId?: string;
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
  answerDescription: { type: String },
  answers: { type: [AnswerSchema], required: true, _id: false },
  quizIds: { type: [String], required: true, validate: [(array: string[]) => array.length > 0, 'Question must belong to at least one quiz'] },
  authorId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QuestionModel = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default QuestionModel;
