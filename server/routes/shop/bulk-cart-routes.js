import express from "express";
import {
  addToBulkCart,
  updateBulkCartItemQty,
  deleteBulkCartItem,
  fetchBulkCartItems,
  // clearBulkCart,
} from "../../controllers/shop/bulkCart-controller.js";

const router = express.Router();

router.post("/add", addToBulkCart);
router.get("/get/:userId", fetchBulkCartItems);
router.put("/update-cart", updateBulkCartItemQty);
router.delete("/:userId/:productId", deleteBulkCartItem);
// router.delete("/clear/:userId", clearBulkCart);

export default router;