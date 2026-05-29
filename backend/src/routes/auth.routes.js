import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "customer" });
  return res.status(201).json({ token: sign(user), user: { id: user._id, name, email, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  return res.json({
    token: sign(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.post("/bootstrap-admin", async (req, res) => {
  const { name, email, password, setupKey } = req.body;
  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(403).json({ message: "Invalid setup key" });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "admin" });
  return res.status(201).json({ token: sign(user), user: { id: user._id, name, email, role: user.role } });
});

export default router;
