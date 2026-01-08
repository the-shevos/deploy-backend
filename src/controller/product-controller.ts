import { Request, Response } from "express";
import { Product } from "../model/Product";

// MulterRequest supports array uploads and single uploads
interface MulterRequest extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  file?: Express.Multer.File;
}

// CREATE PRODUCT
export const createProduct = async (req: MulterRequest, res: Response) => {
  try {
    const { name, description, category, price, discountPrice, stock } = req.body;

    // Safely handle uploaded files
    const filesArray = Array.isArray(req.files) ? req.files : [];
    const images = filesArray.map((file) => file.path);

    const product = new Product({
      name,
      description,
      category,
      price,
      discountPrice,
      stock,
      images,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req: MulterRequest, res: Response) => {
  try {
    const updateData: any = { ...req.body };

    // Safely handle uploaded files
    const filesArray = Array.isArray(req.files) ? req.files : [];
    if (filesArray.length > 0) {
      updateData.images = filesArray.map((file) => file.path);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product updated", product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
