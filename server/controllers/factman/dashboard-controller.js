import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lastMonthProducts = await Product.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
     },
   });
  const productChange = lastMonthProducts
    ? ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100
    : 0;

  const activeUsers = await User.countDocuments({
    role: { $in: ["buyer", "user", "seller", "store_keeper", "accountant", "assistance", "factman"] },
  });
  const lastMonthUsers = await User.countDocuments({
    role: { $in: ["buyer", "user", "seller", "store_keeper", "accountant", "assistance", "factman"] },
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });
  const userChange = lastMonthUsers
    ? ((activeUsers - lastMonthUsers) / lastMonthUsers) * 100
    : 0;


    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const lastMonthPendingOrders = await Order.countDocuments({
      orderStatus: "pending",
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });
    const pendingOrdersChange = lastMonthPendingOrders
      ? ((pendingOrders - lastMonthPendingOrders) / lastMonthPendingOrders) * 100
      : 0;


    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    const monthlyRevenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    const lastMonthRevenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;

    const revenueChange = lastMonthRevenue
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
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
