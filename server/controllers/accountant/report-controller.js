import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

export const generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.body;

    const matchStage = {
      $match: {
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        paymentStatus: "completed",
      },
    };

    const groupStage = {
      $group: {
        _id: {
          [groupBy === "day"
            ? "$dayOfYear"
            : groupBy === "month"
            ? "$month"
            : "$year"]: "$orderDate",
        },
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    };

    const salesData = await Order.aggregate([matchStage, groupStage]);

    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const generateInventoryReport = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;

    const inventoryData = await Product.aggregate([
      {
        $project: {
          title: 1,
          currentStock: 1,
          lowStockThreshold: 1,
          status: {
            $cond: [
              { $lte: ["$currentStock", "$lowStockThreshold"] },
              {
                $cond: [
                  { $eq: ["$currentStock", 0] },
                  "out_of_stock",
                  "low_stock",
                ],
              },
              "in_stock",
            ],
          },
        },
      },
      { $match: { status: { $ne: "in_stock" } } },
    ]);

    res.status(200).json({
      success: true,
      data: inventoryData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  generateSalesReport,
  generateInventoryReport,
};