import express from "express";
import { User } from "../model/User";
import {
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controller/user-login-controller";

const router = express.Router();

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.get("/reset-password", (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Invalid or missing token");

  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f6f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 380px;
            text-align: center;
          }

          h2 {
            margin-bottom: 10px;
            color: #6A1B9A;
          }

          p {
            color: #555;
            font-size: 14px;
            margin-bottom: 25px;
          }

          input[type=password] {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 15px;
          }

          button {
            width: 100%;
            padding: 12px;
            background: #8E24AA;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: 0.2s ease;
          }

          button:hover {
            background: #357ac9;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h2>Reset Your Password</h2>
          <p>Please enter your new password below to securely reset your account.</p>

          <form action="/api/v1/user/reset-password" method="POST">
            <input type="hidden" name="token" value="${token}" />
            
            <input 
              type="password" 
              name="newPassword" 
              placeholder="Enter new password" 
              required
            />

            <button type="submit">Reset Password</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

router.post(
  "/reset-password",
  express.urlencoded({ extended: true }),
  resetPassword
);

export default router;
