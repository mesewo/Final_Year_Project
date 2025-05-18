import express from "express";
import { getSellerStore } from "../../controllers/seller/store-controller.js";
import { sellerAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get("/", sellerAuthMiddleware, getSellerStore);

export default router;