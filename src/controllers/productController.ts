import { Request, Response } from "express";
import { Product } from "../models/Product";
import { AuthenticatedRequest } from "../middleware/auth";
import { slugify } from "../utils/slug";
import { Brand } from "../models/Brand";
import { Category } from "../models/Category";

const normalizeArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(",").map((v) => v.trim()).filter(Boolean);
    }
    return [value];
  }
  return [];
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      brand,
      category,
      nicotine_level,
      puff_count,
      battery_capacity,
      liquid_capacity,
      coil_type,
      slug
    } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: "Name, price, and stock are required" });
    }

    const bodyImages = normalizeArray(req.body.images);
    const fileImages = (req.files as Express.Multer.File[] | undefined)?.map((f) => f.path) || [];

    const product = await Product.create({
      name,
      slug: slug ? slugify(slug) : slugify(name),
      description,
      price,
      stock,
      brand,
      category,
      nicotine_level,
      puff_count,
      battery_capacity,
      liquid_capacity,
      coil_type,
      images: [...bodyImages, ...fileImages],
      flavors: normalizeArray(req.body.flavors)
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const filter: Record<string, unknown> = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const [matchingBrands, matchingCategories] = await Promise.all([
        Brand.find({ name: searchRegex }).select("_id"),
        Category.find({ name: searchRegex }).select("_id")
      ]);

      const brandIds = matchingBrands.map((brand) => brand._id);
      const categoryIds = matchingCategories.map((category) => category._id);
      const orClauses: Record<string, unknown>[] = [{ name: searchRegex }];

      if (brandIds.length) {
        orClauses.push({ brand: { $in: brandIds } });
      }
      if (categoryIds.length) {
        orClauses.push({ category: { $in: categoryIds } });
      }

      filter.$or = orClauses;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .populate("flavors", "name slug");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .populate("flavors", "name slug");
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
    const {
      name,
      description,
      price,
      stock,
      brand,
      category,
      nicotine_level,
      puff_count,
      battery_capacity,
      liquid_capacity,
      coil_type,
      slug
    } = req.body;

    const fileImages = (req.files as Express.Multer.File[] | undefined)?.map((f) => f.path) || [];
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slugify(slug || (name as string));
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (stock !== undefined) update.stock = stock;
    if (brand !== undefined) update.brand = brand;
    if (category !== undefined) update.category = category;
    if (nicotine_level !== undefined) update.nicotine_level = nicotine_level;
    if (puff_count !== undefined) update.puff_count = puff_count;
    if (battery_capacity !== undefined) update.battery_capacity = battery_capacity;
    if (liquid_capacity !== undefined) update.liquid_capacity = liquid_capacity;
    if (coil_type !== undefined) update.coil_type = coil_type;

    const bodyImages = normalizeArray(req.body.images);
    const bodyFlavors = normalizeArray(req.body.flavors);
    if (bodyImages.length || fileImages.length) {
      update.images = [...bodyImages, ...fileImages];
    }
    if (bodyFlavors.length) {
      update.flavors = bodyFlavors;
    }

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
