import express from "express";
import { generateSellerSalesReport } from "../../controllers/seller/report-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get("/sales", authMiddleware, generateSellerSalesReport);

export default router;