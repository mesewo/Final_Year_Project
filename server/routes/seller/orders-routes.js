import express from "express";
import {
  getAllOrdersOfSeller,
  getOrderDetailsForSeller,
  updateOrderStatusForSeller,
} from "../../controllers/seller/order-controller.js";


const router = express.Router();

// Get all orders for a seller
router.get("/get", getAllOrdersOfSeller);

// Get details for a specific order
router.get("/details/:id", getOrderDetailsForSeller);

// Update order status
router.put("/update/:id", updateOrderStatusForSeller);

export default router;