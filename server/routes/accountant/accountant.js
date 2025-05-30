import express from "express";
import transactionRouter from "./Transaction.js";
const router = express.Router();

// Mock financial summary endpoint
router.get("/financial-summary", (req, res) => {
  res.json({
    totalSales: 10000,
    totalExpenses: 7000,
    inventoryValue: 5000,
  });
});

// ...other accountant routes...

router.use("/transactions", transactionRouter);

export default router;