import Order from "../../models/Order.js";
import User from "../../models/User.js";

export const generateUserActivityReport = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - parseInt(days));

    const report = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $project: {
          userName: 1,
          email: 1,
          role: 1,
          lastLogin: 1,
          orderCount: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" },
        },
      },
      { $sort: { lastLogin: -1 } },
    ]);

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const generateSalesTrendReport = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - parseInt(days));

    const report = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: dateThreshold },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  generateUserActivityReport,
  generateSalesTrendReport,
};