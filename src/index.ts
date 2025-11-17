import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { connectToDatabase } from "./config/database";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_DIR || "uploads")));

app.get("/", (_req, res) => {
  res.json({ message: "ShisashopNepal API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

connectToDatabase(mongoUri).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
