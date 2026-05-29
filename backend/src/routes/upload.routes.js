import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, adminOnly, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const isVideo = req.file.mimetype.startsWith("video/");
  const folder = "jasmine-towels";
  const response = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: isVideo ? "video" : "image"
  });
  res.status(201).json({
    url: response.secure_url,
    publicId: response.public_id,
    mediaType: isVideo ? "video" : "image"
  });
});

router.delete("/:publicId", protect, adminOnly, async (req, res) => {
  const { publicId } = req.params;
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  res.json(result);
});

export default router;
