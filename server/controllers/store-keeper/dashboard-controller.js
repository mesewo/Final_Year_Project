// import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Store from "../../models/Store.js";
import ProductRequest from "../../models/ProductRequest.js";

export const getStorekeeperDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    // const totalOrders = await Order.countDocuments();
    const pendingOrders = await ProductRequest.countDocuments({ status: "pending" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalStores = await Store.countDocuments(); // <-- Add this line

    // Low stock products (example: threshold = 5)
    const lowStockProducts = await Product.countDocuments({ totalStock: { $lte: 5 } });

    // Inventory value (sum of all product stock * price)
    const inventoryValueAgg = await Product.aggregate([
      { $project: { value: { $multiply: ["$totalStock", "$price"] } } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);
    const inventoryValue = inventoryValueAgg[0]?.total || 0;

    // const recentOrders = await Order.find()
    //   .sort({ createdAt: -1 })
    //   .limit(5)
    //   .lean();

    res.status(200).json({
      totalProducts,
      // totalOrders,
      pendingOrders,
      totalSellers,
      totalStores,
      lowStockProducts,
      inventoryValue,
      // recentOrders,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getRecentProductRequests = async (req, res) => {
  try {
    const requests = await ProductRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("product seller store")
      .lean();
    res.status(200).json({ success: true, data: requests });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};