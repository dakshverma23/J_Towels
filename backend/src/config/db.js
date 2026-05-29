import mongoose from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("FATAL: MONGO_URI is missing in environment variables.");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("Check: 1) MONGO_URI is correct  2) Atlas IP whitelist includes 0.0.0.0/0");
    process.exit(1);
  }
};
