import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  email: string;
  token: string;
  status: "pending" | "accepted" | "declined";
  sentAt: Date;
  respondedAt?: Date;
  guestName?: string;
  companions: number;
  song?: string;
  message?: string;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    token: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    sentAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
    guestName: { type: String, trim: true },
    companions: { type: Number, default: 0, min: 0 },
    song: { type: String, trim: true },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ?? mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;
