import express from "express";
import {
  generateSalesTrendReport,
  generateInventoryReport
} from "../../controllers/store-keeper/report-controller.js";

const router = express.Router();

router.get("/sales-trend", generateSalesTrendReport);
router.get("/inventory", generateInventoryReport);

export default router;