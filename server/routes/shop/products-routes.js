import express from "express";
import {
  getFilteredProducts,
  getProductDetails,
  getFeaturedStoreProducts,
} from "../../controllers/shop/products-controller.js";

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/featured-store-products", getFeaturedStoreProducts);

export default router;