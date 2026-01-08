import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/User";

interface AuthRequest extends Request {
  user?: any;
}

export async function isAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res.status(401).json({ error: "Authorization token missing" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "admin")
      return res
        .status(403)
        .json({ error: "Only admins can perform this action" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
