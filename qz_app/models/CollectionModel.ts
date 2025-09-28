import mongoose, { Schema, Document } from "mongoose";

interface ICollection extends Document {
  id: string;
  name: string;
  description?: string;
  authorId: string;
  quizIds: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  authorId: { type: String, required: true },
  quizIds: { type: [String], default: [] },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CollectionModel = mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);

export default CollectionModel;
