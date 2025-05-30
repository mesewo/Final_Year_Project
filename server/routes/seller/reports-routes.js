import express from "express";
import { generateSellerSalesReport } from "../../controllers/seller/report-controller.js";
import { sellerAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get("/sales", sellerAuthMiddleware, generateSellerSalesReport);

export default router;