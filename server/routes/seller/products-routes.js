import express from "express";
import {
  getSellerProducts,
  addSellerProduct,
  getUnsoldProducts,
} from "../../controllers/seller/product-controller.js";

const router = express.Router();

router.get("/", getSellerProducts);
router.post("/", addSellerProduct);
router.get("/unsold", getUnsoldProducts);

export default router;