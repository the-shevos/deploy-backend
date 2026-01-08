import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getLatestOrders,
  getOrdersByUser
} from "../controller/order-controller";

const router = express.Router();

router.get("/", getOrders);

router.get("/latest", getLatestOrders);

router.get("/:id", getOrderById);

router.post("/", createOrder);

router.put("/:id/status", updateOrderStatus);

router.put("/:id/cancel", cancelOrder);

router.get("/user/:userId", getOrdersByUser);

export default router;
