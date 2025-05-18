import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

export const getStorekeeperDashboardStats = async (req, res) => {
  try {
    // Example stats: total products, total orders, pending orders, active users
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.status(200).json({
      totalProducts,
      totalOrders,
      pendingOrders,
      activeUsers,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getRecentStoreOrders = async (req, res) => {
  try {
    // Last 5 orders, newest first
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    res.status(200).json(recentOrders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch recent orders" });
  }
};