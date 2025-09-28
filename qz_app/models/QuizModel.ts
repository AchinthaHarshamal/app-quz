import mongoose, { Schema, Document } from "mongoose";

interface IQuiz extends Document {
  id: string;
  topic: string;
  description?: string;
  questionIds: string[];
  rating?: number;
  attempts?: number;
  quizState: "draft" | "published";
  authorId?: string;
  collectionId?: string; // Optional - quiz can exist without collection
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
  id: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String },
  questionIds: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  quizState: { type: String, enum: ["draft", "published"], default: "draft" },
  authorId: { type: String },
  collectionId: { type: String }, // Optional reference to collection
  randomizeQuestions: { type: Boolean, default: false },
  randomizeAnswers: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QuizModel = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default QuizModel;
