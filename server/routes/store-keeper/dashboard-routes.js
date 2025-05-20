import express from "express";
import {
  getStorekeeperDashboardStats,
  getRecentProductRequests
  // getRecentStoreOrders,
} from "../../controllers/store-keeper/dashboard-controller.js";
import { storekeeperAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.get('/stats', storekeeperAuthMiddleware, getStorekeeperDashboardStats);
router.get("/recent-requests", storekeeperAuthMiddleware, getRecentProductRequests);
// router.get("/orders/recent", storekeeperAuthMiddleware, getRecentStoreOrders);

export default router;