import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion extends Document {
  title: string;
  body: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;