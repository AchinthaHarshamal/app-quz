import mongoose, { Schema, Document } from "mongoose";

interface IQuiz extends Document {
  id: string;
  topic: string;
  questionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
  id: { type: String, required: true },
  topic: { type: String, required: true },
  questionIds: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QuizModel = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default QuizModel;
