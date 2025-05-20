import express from "express";
import {
  getSellerProducts,
  addSellerProduct,
  getApprovedSellerProducts,
  getUnsoldProducts,
} from "../../controllers/seller/product-controller.js";
import { sellerAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get("/", sellerAuthMiddleware, getSellerProducts);
router.post("/", sellerAuthMiddleware,  addSellerProduct);
router.get("/approved", sellerAuthMiddleware, getApprovedSellerProducts);
router.get("/unsold", sellerAuthMiddleware,  getUnsoldProducts);

export default router;