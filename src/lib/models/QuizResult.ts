import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizResult extends Document {
  email: string;
  name: string;
  score: number;
  totalQuestions: number;
  attempt: number;
  answers: number[];
  completedAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    attempt: { type: Number, required: true, min: 1, max: 2 },
    answers: { type: [Number], required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuizResultSchema.index({ email: 1, attempt: 1 });

const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult ??
  mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
