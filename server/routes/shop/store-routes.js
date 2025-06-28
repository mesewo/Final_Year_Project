import express from "express";
import { getAllStores, getStoreById } from "../../controllers/shop/store-controller.js";

const router = express.Router();

router.get("/", getAllStores);
router.get("/:storeId", getStoreById);

export default router;