import express from "express";
import { adminOnly, protect } from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { items, shippingAddress, notes } = req.body;
  if (!items?.length) return res.status(400).json({ message: "Order items are required" });
  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress,
    notes
  });
  res.status(201).json(order);
});

router.get("/mine", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/", protect, adminOnly, async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Order not found" });
  res.json(updated);
});

export default router;
