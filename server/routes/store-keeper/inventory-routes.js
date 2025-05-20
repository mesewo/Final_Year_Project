import express from "express";
import inventoryController from "../../controllers/store-keeper/inventory-controller.js";
import { storekeeperAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

// Get all products in inventory
router.get("/",  storekeeperAuthMiddleware, async (req, res) => {
  try {
    // You may want to filter products for this storekeeper
    const products = await inventoryController.getInventory
      ? inventoryController.getInventory(req, res)
      : res.status(501).json({ success: false, message: "Not implemented" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update stock for a product
router.put("/:productId",  storekeeperAuthMiddleware,  inventoryController.updateStock);

// Request stock replenishment (optional, if you want a POST endpoint)
router.post("/request",  storekeeperAuthMiddleware,  inventoryController.requestStockReplenishment);

export default router;