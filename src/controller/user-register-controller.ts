import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { User } from "../model/User";
import { sendVerificationEmail } from "../utills/send-email";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userName, userEmail, userPassword, role } = req.body;

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      userName,
      userEmail,
      userPassword: hashedPassword,
      role,
      verifyToken,
    });

    await user.save();
    sendVerificationEmail(userEmail, verifyToken);

    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

export const getVerifiedUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      isEmailVerified: true,
      role: { $ne: "admin" },
    }).select("userName userEmail role isBlocked createdAt");

    res.status(200).json({
      success: true,
      message: "Verified users fetched successfully",
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching verified users",
      error: error.message,
    });
  }
};
