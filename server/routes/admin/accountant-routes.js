import express from "express";
import {
  getAllTransactions,
  getAllRequests,
  getAccountantStats,
} from "../../controllers/admin/accountant-controller.js";

const router = express.Router();

router.get("/transactions", getAllTransactions);
router.get("/requests", getAllRequests);
router.get("/stats", getAccountantStats);

export default router;