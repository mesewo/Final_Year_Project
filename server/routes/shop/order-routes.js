import express from "express";
import {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  // approveBulkOrder,
  // rejectBulkOrder,
  // getBulkOrders,
} from "../../controllers/shop/order-controller.js";
import { getBulkOrdersForStorekeeper } from "../../controllers/productRequest-controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/user/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
// router.post("/bulk/orders/approve", approveBulkOrder);
// router.post("/bulk/orders/reject", rejectBulkOrder);
router.get("/bulk/:storekeeperId", getBulkOrdersForStorekeeper);
// router.get("/?type=bulk", getBulkOrders);

export default router;