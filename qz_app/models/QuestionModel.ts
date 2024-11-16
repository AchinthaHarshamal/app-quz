import { Answer } from '@/types/questions';
import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion extends Document {
  id: string;
  problem: string;
  correctAnswerID: string;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  id: { type: String, required: true },
  answer: { type: String, required: true }
});

const QuestionSchema: Schema = new Schema({
  id: { type: String, required: true },
  problem: { type: String, required: true },
  correctAnswerID: { type: String, required: true },
  answers: { type: [AnswerSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Question_ = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question_;