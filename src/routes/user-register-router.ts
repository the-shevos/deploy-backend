import express from "express";
import { User } from "../model/User";
import {
  createUser,
  getVerifiedUsers,
} from "../controller/user-register-controller";
const router = express.Router();

router.post("/register", createUser);

router.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).send("Verification token missing");

    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).send("Invalid or expired token");

    user.isEmailVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.send(`
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verified | MyApp</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: "Inter", sans-serif;
        background: #f9f9f9;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .card {
        background: #fff;
        border-radius: 20px;
        padding: 40px 30px;
        max-width: 500px;
        background-color: #e9e5e5;
        border: 2px solid #6a0dad;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        position: relative;
      }
      .card-header {
        background: #6a0dad;
        color: #fff;
        font-size: 24px;
        font-weight: 700;
        padding: 20px;
        border-radius: 20px 20px 0 0;
        margin: -40px -30px 30px -30px; /* extend to card edges */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .check-icon {
        font-size: 60px;
        color: #6a0dad;
        margin-bottom: 20px;
      }
      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #6a0dad;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
        color: #555;
      }
      .btn {
        display: inline-block;
        background: #6a0dad;
        color: #fff;
        padding: 12px 30px;
        border-radius: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.3s, transform 0.3s;
      }
      .btn:hover {
        background: #8a2be2;
        transform: translateY(-2px);
      }
      footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="card-header">MyApp</div>
      <div class="check-icon"><i class="fas fa-check-circle"></i></div>
      <h1>Email Verified!</h1>
      <p>
        Congratulations! Your email has been successfully verified. Your account
        is now fully active and ready to use.
      </p>
      <p>
        Explore all features, enjoy personalized content, and stay updated with
        our latest offerings. We're excited to have you onboard!
      </p>
<a class="btn" href="http://localhost:5173/login">Go to Login</a>
    </div>
  </body>
</html>

    `);
  } catch (err: any) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.get("/check-username", async (req, res) => {
  try {
    const userName = req.query.userName as string;
    if (!userName) return res.status(400).json({ available: false });

    const existingUser = await User.findOne({ userName });
    res.json({ available: !existingUser });
  } catch (err: any) {
    res.status(500).json({ available: false });
  }
});

router.get("/check-email", async (req, res) => {
  try {
    const userEmail = req.query.userEmail as string;
    if (!userEmail) return res.status(400).json({ available: false });

    const existingUser = await User.findOne({ userEmail });
    res.json({ available: !existingUser });
  } catch (err: any) {
    res.status(500).json({ available: false });
  }
});

router.get("/verified-users", getVerifiedUsers);

router.patch("/block-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ success: true, message: "User blocked", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/unblock-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ success: true, message: "User unblocked", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
