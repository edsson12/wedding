import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizQuestion extends Document {
  text: { es: string; en: string; fr: string };
  options: Array<{ es: string; en: string; fr: string }>;
  correctIndex: number;
  order: number;
  active: boolean;
}

const LocalizedStringSchema = new Schema(
  {
    es: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
    fr: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    text: { type: LocalizedStringSchema, required: true },
    options: { type: [LocalizedStringSchema], required: true, validate: (v: unknown[]) => v.length >= 2 },
    correctIndex: { type: Number, required: true, min: 0 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

QuizQuestionSchema.index({ order: 1 });

const QuizQuestion: Model<IQuizQuestion> =
  mongoose.models.QuizQuestion ??
  mongoose.model<IQuizQuestion>("QuizQuestion", QuizQuestionSchema);

export default QuizQuestion;
