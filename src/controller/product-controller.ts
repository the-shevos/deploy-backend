import { Request, Response } from "express";
import { Product } from "../model/Product";

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

export const createProduct = async (req: MulterRequest, res: Response) => {
  try {
    const { name, description, category, price, discountPrice, stock } =
      req.body;

    const images = req.files?.map((file: any) => file.path);

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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: MulterRequest, res: Response) => {
  try {
    const updateData: any = { ...req.body };
    if (req.files) updateData.images = req.files.map((file: any) => file.path);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product updated", product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
