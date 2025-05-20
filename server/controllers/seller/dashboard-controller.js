import mongoose from "mongoose";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import StoreProduct from "../../models/StoreProduct.js";

export const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const storeProducts = await StoreProduct.find({ seller: req.user.id })
    .populate("product");
    // Total products
    const totalProducts = storeProducts
      .filter(sp => sp.product)
      .map(sp => ({
        ...sp.product.toObject(),
        totalStock: sp.quantity,
      }));
    // Last month products
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const lastMonthProducts = await Product.countDocuments({
      seller: new mongoose.Types.ObjectId(sellerId),
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });
    const productChange = lastMonthProducts
      ? ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100
      : 0;

    // Pending orders
    const pendingOrders = await Order.countDocuments({ seller: new mongoose.Types.ObjectId(sellerId), orderStatus: "pending" });
    const lastMonthPendingOrders = await Order.countDocuments({
      seller: new mongoose.Types.ObjectId(sellerId),
      orderStatus: "pending",
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });
    const pendingOrdersChange = lastMonthPendingOrders
      ? ((pendingOrders - lastMonthPendingOrders) / lastMonthPendingOrders) * 100
      : 0;

    // Monthly sales (this month)
    const monthlySalesAgg = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId), createdAt: { $gte: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const monthlySales = monthlySalesAgg[0]?.total || 0;

    // Last month sales
    const lastMonthSalesAgg = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId), createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const lastMonthSales = lastMonthSalesAgg[0]?.total || 0;
    const salesChange = lastMonthSales
      ? ((monthlySales - lastMonthSales) / lastMonthSales) * 100
      : 0;

    // Conversion rate (completed/total orders)
    const totalOrders = await Order.countDocuments({ seller: new mongoose.Types.ObjectId(sellerId) });
    const completedOrders = await Order.countDocuments({ seller: new mongoose.Types.ObjectId(sellerId), orderStatus: "completed" });
    const conversionRate = totalOrders ? ((completedOrders / totalOrders) * 100).toFixed(2) : 0;

    // Recent orders (last 5)
    const recentOrders = await Order.find({ seller: new mongoose.Types.ObjectId(sellerId) })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id userId orderItems totalAmount orderStatus createdAt")
      .populate("userId", "name")
      .lean();

    const formattedRecentOrders = recentOrders.map(order => ({
      _id: order._id,
      customerName: order.userId?.name || "N/A",
      itemCount: order.orderItems.length,
      totalAmount: order.totalAmount,
      status: order.orderStatus,
      createdAt: order.createdAt,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        productChange,
        pendingOrders,
        pendingOrdersChange,
        monthlySales,
        salesChange,
        conversionRate,
      },
      recentOrders: formattedRecentOrders,
    });
  } catch (e) {
    console.error("Seller Dashboard Stats Error:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller dashboard stats",
      error: e.message,
    });
  }
};