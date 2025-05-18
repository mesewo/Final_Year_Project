import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const activeUsers = await User.countDocuments({
      role: { $in: ["buyer", "user", "seller", "store_keeper", "accountant", "assistance", "factman"] },
    });
    

    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const monthlyRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const monthlyRevenue = monthlyRevenueData[0]?.total || 0;
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeUsers,
        pendingOrders,
        monthlyRevenue,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
