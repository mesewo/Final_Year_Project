import Order from "../../models/Order.js";
// import Product from "../../models/Product.js";
import mongoose from "mongoose";

// Generate sales report for a seller within a date range
export const generateSellerSalesReport = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    const { startDate, endDate } = req.query;

    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start and end date are required!" });
    }

    // Aggregate sales by product
    const sales = await Order.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          orderStatus: { $in: ["completed", "delivered"] }, // Only count completed/delivered sales
        }
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $unwind: "$productInfo"
      },
      {
        $project: {
          _id: 1,
          productName: "$productInfo.title",
          totalSold: 1,
          totalRevenue: 1,
        }
      }
    ]);

    res.status(200).json({ success: true, data: sales });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};