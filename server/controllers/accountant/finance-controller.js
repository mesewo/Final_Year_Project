import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      $match: {
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        paymentStatus: "completed",
      },
    };

    const [sales, expenses, inventory] = await Promise.all([
      // Sales aggregation
      Order.aggregate([
        matchStage,
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
      ]),
      // Expenses aggregation (mock - replace with actual expense data)
      Promise.resolve([{ _id: null, totalExpenses: 5000 }]),
      // Inventory value calculation
      Product.aggregate([
        {
          $group: {
            _id: null,
            inventoryValue: { $sum: { $multiply: ["$price", "$totalStock"] } },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSales: sales[0]?.totalSales || 0,
        totalExpenses: expenses[0]?.totalExpenses || 0,
        inventoryValue: inventory[0]?.inventoryValue || 0,
        profit: (sales[0]?.totalSales || 0) - (expenses[0]?.totalExpenses || 0),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  getFinancialSummary,
};