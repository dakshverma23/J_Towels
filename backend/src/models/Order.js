import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: true }
      }
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
