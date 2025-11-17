import { Request, Response } from "express";
import { Product } from "../models/Product";
import { AuthenticatedRequest } from "../middleware/auth";

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file?.path;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: "Name, price, and stock are required" });
    }

    const product = await Product.create({ name, description, price, stock, imageUrl });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file?.path;

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (stock !== undefined) update.stock = stock;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
