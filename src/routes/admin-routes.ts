import express from "express";
import { User } from "../model/User";
import bcrypt from "bcrypt";
import { isAdmin } from "../middleware/auth-admin-middleware";
import { upload } from "../middleware/multer";

const router = express.Router();

router.put(
  "/update-profile/:id",
  isAdmin,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { userName, userEmail, userPassword } = req.body;

      const updateData: any = { userName, userEmail };

      if (userPassword) {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        updateData.userPassword = hashedPassword;
      }

      if (req.file) {
        updateData.profileImage = req.file.path;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-userPassword");

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/me", isAdmin, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    const { userPassword, ...userData } = user.toObject();

    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
