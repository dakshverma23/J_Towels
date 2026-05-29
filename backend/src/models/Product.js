import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    minOrderQty: { type: Number, default: 100 },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    badges: [{ type: String }],
    media: [
      {
        url: String,
        publicId: String,
        mediaType: { type: String, enum: ["image", "video"], default: "image" }
      }
    ],
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
