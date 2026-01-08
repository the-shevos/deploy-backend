import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utills/cloudinary";

// Type-safe Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "products",
      format: file.mimetype.split("/")[1], // 'jpg', 'png', etc.
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
