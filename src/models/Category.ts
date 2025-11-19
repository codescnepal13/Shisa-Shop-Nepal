import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  brands: mongoose.Types.ObjectId[];
  flavors: mongoose.Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, trim: true },
    brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
    flavors: [{ type: Schema.Types.ObjectId, ref: "Flavor" }]
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
