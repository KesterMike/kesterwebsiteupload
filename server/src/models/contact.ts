import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  company?: string;
  referral?: string;
  email: string;
  phone?: string;
  interests?: string[];
  message: string;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    company: { type: String },
    referral: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    interests: { type: [String] },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IContact>("Contact", contactSchema);
