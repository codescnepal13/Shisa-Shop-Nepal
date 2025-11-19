import { Request, Response } from "express";
import { Category } from "../models/Category";
import { slugify } from "../utils/slug";

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

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, brands, flavors } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = await Category.create({
      name,
      slug: slugify(slug || name),
      description,
      brands: normalizeArray(brands),
      flavors: normalizeArray(flavors)
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).populate("brands").populate("flavors");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id).populate("brands").populate("flavors");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, brands, flavors } = req.body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slugify(slug || name);
    if (description !== undefined) update.description = description;
    if (brands !== undefined) update.brands = normalizeArray(brands);
    if (flavors !== undefined) update.flavors = normalizeArray(flavors);

    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};
