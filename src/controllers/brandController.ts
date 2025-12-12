import { Request, Response } from "express";
import { Brand } from "../models/Brand";
import { slugify } from "../utils/slug";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, slug, logo, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const logoPath = (req as any).file?.path || logo;

    const brand = await Brand.create({
      name,
      slug: slugify(slug || name),
      logo: logoPath,
      description
    });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Failed to create brand", error });
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const filter = search ? { name: { $regex: new RegExp(search, "i") } } : {};

    const brands = await Brand.find(filter).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch brands", error });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch brand", error });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { name, slug, logo, description } = req.body;
    const update: Record<string, string> = {};
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slugify(slug || name);
    const logoPath = (req as any).file?.path || logo;
    if (logoPath !== undefined) update.logo = logoPath;
    if (description !== undefined) update.description = description;

    const brand = await Brand.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: "Failed to update brand", error });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete brand", error });
  }
};
