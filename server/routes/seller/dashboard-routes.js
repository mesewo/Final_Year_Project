import express from "express";
import { getSellerDashboardStats } from "../../controllers/seller/dashboard-controller.js";
import { sellerAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get("/dashboard-stats", sellerAuthMiddleware, getSellerDashboardStats);

export default router;