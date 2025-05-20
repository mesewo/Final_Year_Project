import express from "express";
import {
  requestProduct,
  approveProductRequest,
  rejectProductRequest,
  getAllRequests,
  getMyRequests,
  getProductRequestTrend,
} from "../controllers/productRequest-controller.js";
import { storekeeperAuthMiddleware, sellerAuthMiddleware } from "../controllers/auth/auth-controller.js"; // Adjust if your auth paths differ

const router = express.Router();

router.get("/", storekeeperAuthMiddleware, getAllRequests);
router.post("/request", sellerAuthMiddleware, requestProduct);
router.put("/approve/:requestId", storekeeperAuthMiddleware, approveProductRequest); // Storekeeper
router.put("/reject/:requestId", storekeeperAuthMiddleware, rejectProductRequest); // Storekeeper
router.get("/me", sellerAuthMiddleware, getMyRequests);
router.get("/trend", storekeeperAuthMiddleware, getProductRequestTrend); // Storekeeper

export default router;
