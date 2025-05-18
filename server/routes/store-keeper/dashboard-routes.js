import express from "express";
import {
  getStorekeeperDashboardStats,
  getRecentStoreOrders,
} from "../../controllers/store-keeper/dashboard-controller.js";
import { storekeeperAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get("/stats", storekeeperAuthMiddleware, getStorekeeperDashboardStats);
router.get("/orders/recent", storekeeperAuthMiddleware, getRecentStoreOrders);

export default router;