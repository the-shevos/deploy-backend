import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

import { User } from "../model/User";
import { sendPasswordResetEmail } from "../utills/send-email";

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { userName, userPassword } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({
        message: "Please verify your email before logging in",
      });
      return;
    }

    const isPasswordCorrect = bcrypt.compareSync(
      userPassword,
      user.userPassword
    );

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const payload = {
      _id: user._id.toString(),
      userName: user.userName,
      email: user.userEmail,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH as string, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        profileImage: user.profileImage || "",
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { userName } = req.body;

    if (!userName)
      return res.status(400).json({ error: "Username is required" });

    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetLink = `http://localhost:3000/api/v1/user/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.userEmail, resetLink);

    res.json({ message: "Reset link sent to your registered email!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send("<h3>Invalid or expired password reset link.</h3>");
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.userPassword = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.send(`
      <html>
        <body style="font-family:Arial;text-align:center;padding:40px;">
          <h2>Password Reset Successful!</h2>
          <p>Your password has been updated successfully.</p>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send("Server error: " + err.message);
  }
}
