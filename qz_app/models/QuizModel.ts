import mongoose, { Schema, Document } from 'mongoose';

interface IQuiz extends Document {
  id: string;
  name: string;
  questionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  questionIds: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Quiz_ = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz_;