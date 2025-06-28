import Order from "../../models/Order.js";
import User from "../../models/User.js";

// Get all transactions (approved orders)
export const getAllTransactions = async (req, res) => {
  try {
    // Only approved orders (storekeeper or seller)
    const orders = await Order.find({ orderStatus: { $in: ["confirmed", "delivered", "inShipping"] } })
      .populate("userId", "userName email")
      .populate("storekeeper", "userName email")
      .populate("seller", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions", error: e.message });
  }
};

// Get all requests (pending storekeeper requests)
export const getAllRequests = async (req, res) => {
  try {
    // Requests to storekeeper (pending orders of type 'bulk')
    const requests = await Order.find({ orderStatus: "pending", type: "bulk" })
      .populate("userId", "userName email")
      .populate("storekeeper", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch requests", error: e.message });
  }
};

// Optionally: Get summary stats for accountant dashboard
export const getAccountantStats = async (req, res) => {
  try {
    const totalTransactions = await Order.countDocuments({ orderStatus: { $in: ["confirmed", "delivered", "inShipping"] } });
    const totalRequests = await Order.countDocuments({ orderStatus: "pending", type: "bulk" });
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $in: ["confirmed", "delivered", "inShipping"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    res.status(200).json({
      success: true,
      stats: {
        totalTransactions,
        totalRequests,
        totalRevenue: totalRevenue[0]?.total || 0,
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: e.message });
  }
};