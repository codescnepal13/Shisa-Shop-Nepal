import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, upload.single("image"), createProduct);
router.put("/:id", authenticate, upload.single("image"), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
