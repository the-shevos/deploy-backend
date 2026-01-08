import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/product-controller";
import { upload } from "../middleware/multer";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", upload.array("images", 5), createProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
