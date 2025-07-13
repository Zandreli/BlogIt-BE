import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "blogIt",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  res.json({ url: req.file?.path });
});

export default router;
