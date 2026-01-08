import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRegisterRouter from "./routes/user-register-router";
import userLoginRouter from "./routes/user-login-router";
import contactRouter from "./routes/contact-routes";
import googleUsersRouter from "./server/get-google-users";
import productRoutes from "./routes/product-routes";
import orderRouter from "./routes/order-routes";
import adminRouter from "./routes/admin-routes";
import paymentRoutes from "./routes/payment-routes";
import aiRoutes from "./routes/ai-routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://695f4d329d1955000821b287--jacktexe.netlify.app",
    credentials: true,
  })
);

const mongoURI = process.env.MONGO_URI || "";
mongoose
  .connect(mongoURI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRegisterRouter);
app.use("/api/v1/user", userLoginRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api", googleUsersRouter);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/ai", aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
