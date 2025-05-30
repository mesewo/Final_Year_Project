import express from "express";
import {
  getFilteredProducts,
  getProductDetails,
  getPublicStoreProducts,
  getStoreProductStock,
} from "../../controllers/shop/products-controller.js";

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/public-store/:storeId/products", getPublicStoreProducts);
router.get("/store-product-stock/:productId/:storeId", getStoreProductStock);

export default router;