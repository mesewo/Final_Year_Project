import express from "express";
import {
  requestProduct,
  approveProductRequest,
  rejectProductRequest,
  getAllRequests,
  getMyRequests,
  getProductRequestTrend,
  getBulkOrdersForStorekeeper,
  markRequestDelivered,
} from "../controllers/productRequest-controller.js";
import { storekeeperAuthMiddleware, sellerAuthMiddleware, buyerOrSellerAuthMiddleware } from "../controllers/auth/auth-controller.js"; // Adjust if your auth paths differ

const router = express.Router();

router.get("/", storekeeperAuthMiddleware, getAllRequests);
router.post("/request", buyerOrSellerAuthMiddleware, requestProduct);
router.put("/deliver/:requestId", storekeeperAuthMiddleware, markRequestDelivered);
router.put("/approve/:requestId", storekeeperAuthMiddleware, approveProductRequest); // Storekeeper
router.put("/reject/:requestId", storekeeperAuthMiddleware, rejectProductRequest); // Storekeeper
router.get("/me", sellerAuthMiddleware, getMyRequests);
router.get("/trend", storekeeperAuthMiddleware, getProductRequestTrend); 
router.get("/bulk/:storekeeperId",storekeeperAuthMiddleware, getBulkOrdersForStorekeeper);// Storekeeper

export default router;
