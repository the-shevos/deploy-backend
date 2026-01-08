import mongoose, { Document, Schema } from "mongoose";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userPassword: string;
  role: Role;
  isEmailVerified: boolean;
  verifyToken?: string;
  isBlocked: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  refreshToken?: string | null;
  profileImage?: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Username must have at least 3 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed",
      ],
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    userPassword: {
      type: String,
      required: true,
      minlength: [6, "Password must have at least 6 characters"],
      // match: [
      //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      //   "Password must include uppercase, lowercase, number, and symbol",
      // ],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
