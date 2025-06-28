import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Products
    const totalProducts = await Product.countDocuments();
    const prevProducts = await Product.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth }
    });
    const productChange = prevProducts
      ? ((totalProducts - prevProducts) / prevProducts) * 100
      : 0;

    // Users
    const activeUsers = await User.countDocuments({
      role: { $in: ["buyer", "user", "seller", "store_keeper", "accountant", "assistance", "factman"] },
    });
    const prevUsers = await User.countDocuments({
      role: { $in: ["buyer", "user", "seller", "store_keeper", "accountant", "assistance", "factman"] },
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth }
    });
    const userChange = prevUsers
      ? ((activeUsers - prevUsers) / prevUsers) * 100
      : 0;

    // Orders
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const prevPendingOrders = await Order.countDocuments({
      orderStatus: "pending",
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth }
    });
    const pendingOrdersChange = prevPendingOrders
      ? ((pendingOrders - prevPendingOrders) / prevPendingOrders) * 100
      : 0;

    // Revenue
    const monthlyRevenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const monthlyRevenue = monthlyRevenueData[0]?.total || 0;

    const prevRevenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const prevRevenue = prevRevenueData[0]?.total || 0;
    const revenueChange = prevRevenue
      ? ((monthlyRevenue - prevRevenue) / prevRevenue) * 100
      : 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        productChange,
        activeUsers,
        userChange,
        pendingOrders,
        pendingOrdersChange,
        monthlyRevenue,
        revenueChange,
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
