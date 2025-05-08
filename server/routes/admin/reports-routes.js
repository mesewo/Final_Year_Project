import express from "express";
import {
  generateUserActivityReport,
  generateSalesTrendReport,
} from "../../controllers/admin/reports-controller.js";

const router = express.Router();

// Route to generate user activity report
router.get("/user-activity", generateUserActivityReport);

// Route to generate sales trend report
router.get("/sales-trend", generateSalesTrendReport);

export default router;