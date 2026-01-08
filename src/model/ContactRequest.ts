import mongoose, { Document, Schema } from "mongoose";

export interface IContactRequest extends Document {
  name: string;
  email: string;
  message: string;
  isRead: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const contactRequestSchema = new Schema<IContactRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false }, // ← important for new contact count
  },
  { timestamps: true }
);

export const ContactRequest = mongoose.model<IContactRequest>(
  "ContactRequest",
  contactRequestSchema
);
