import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
