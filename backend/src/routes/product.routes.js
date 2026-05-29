import express from "express";
import Product from "../models/Product.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

const defaultProducts = [
  { name: "Duvet Covers", slug: "duvet-covers", category: "Home Textile", description: "Export-grade duvet covers crafted from premium cotton.", price: 8.5, colors: ["White", "Ivory", "Grey"], sizes: ["Twin", "Queen", "King"], badges: ["ISO Certified"] },
  { name: "Kitchen Linen", slug: "kitchen-linen", category: "Kitchen", description: "Durable and absorbent kitchen linen collection.", price: 4.2, colors: ["Beige", "Blue", "Green"], sizes: ["Standard"], badges: ["Bulk Orders"] },
  { name: "Salon Towels", slug: "salon-towels", category: "Professional", description: "Soft and high-absorbency salon towels for repeated usage.", price: 3.1, colors: ["Black", "White", "Brown"], sizes: ["40x70", "50x90"], badges: ["Color Fast"] },
  { name: "Safety Wear", slug: "safety-wear", category: "Industrial", description: "Protective textile gear built for safety workflows.", price: 11.5, colors: ["Orange", "Yellow", "Navy"], sizes: ["S", "M", "L", "XL"], badges: ["High Visibility"] },
  { name: "Pillow Covers", slug: "pillow-covers", category: "Home Textile", description: "Neatly stitched pillow covers in export quality.", price: 2.2, colors: ["White", "Cream", "Charcoal"], sizes: ["Standard", "King"], badges: ["Soft Finish"] },
  { name: "Pot Holders", slug: "pot-holders", category: "Kitchen", description: "Heat-resistant pot holders for safe handling.", price: 1.8, colors: ["Red", "Grey", "Navy"], sizes: ["One Size"], badges: ["Heat Resistant"] },
  { name: "P Series", slug: "p-series", category: "Collections", description: "Premium P series towels for global buyers.", price: 5.4, colors: ["White", "Sky", "Sage"], sizes: ["50x100", "70x140"], badges: ["Best Seller"] },
  { name: "R Series", slug: "r-series", category: "Collections", description: "R series towel line balancing softness and durability.", price: 5.1, colors: ["Sand", "Blue", "Olive"], sizes: ["50x100", "70x140"], badges: ["Global Export"] },
  { name: "Y Series", slug: "y-series", category: "Collections", description: "Youthful design-focused Y series range.", price: 4.9, colors: ["Yellow", "Teal", "White"], sizes: ["50x100", "70x140"], badges: ["New"] },
  { name: "Bath Blankets", slug: "bath-blankets", category: "Bath", description: "Heavy-weight bath blankets for luxury feel.", price: 7.2, colors: ["White", "Stone", "Blue"], sizes: ["70x140", "90x160"], badges: ["High GSM"] },
  { name: "Thermal Towels", slug: "thermal-towels", category: "Bath", description: "Thermal retention towels ideal for spa and wellness.", price: 6.3, colors: ["White", "Coffee", "Grey"], sizes: ["50x100", "70x140"], badges: ["Thermal"] }
];

router.get("/seed", async (_req, res) => {
  const count = await Product.countDocuments();
  if (count === 0) await Product.insertMany(defaultProducts);
  res.json({ message: "Seed complete" });
});

router.get("/", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
});

router.post("/", protect, adminOnly, async (req, res) => {
  const payload = req.body;
  const created = await Product.create(payload);
  res.status(201).json(created);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Deleted successfully" });
});

export default router;
