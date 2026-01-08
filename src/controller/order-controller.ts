import { Request, Response } from "express";
import { Order } from "../model/Order";
import { Product } from "../model/Product";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, totalAmount, paymentMethod, shippingAddress } =
      req.body;

    if (
      !userId ||
      !items ||
      !totalAmount ||
      !paymentMethod ||
      !shippingAddress
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "pending",
    });

    await order.save();
    res.status(201).json({ message: "Order created", order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status === "completed" && order.status !== "completed") {
      for (const item of order.items) {
        const productId = (item.product as any)._id || item.product;
        const product = await Product.findById(productId);
        if (product) {
          product.stock -= item.quantity;
          if (product.stock < 0) product.stock = 0;
          await product.save();
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: false }
    ).populate("items.product");

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (err: any) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: err.message });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLatestOrders = async (req: Request, res: Response) => {
  try {
    const latestOrders = await Order.find()
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(latestOrders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    const transformedOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.map((item: any) => ({
        ...item.toObject(),
        name: item.product?.name,
        image: item.product?.images?.[0],
      })),
    }));

    res.status(200).json(transformedOrders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
