import express from "express";
import {
  getFilteredProducts,
  getProductDetails,
  getPublicStoreProducts,
} from "../../controllers/shop/products-controller.js";

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/public-store/:storeId/products", getPublicStoreProducts);;

export default router;