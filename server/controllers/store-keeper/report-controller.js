import Order from "../../models/Order.js";
// import Product from "../../models/Product.js";
import User from "../../models/User.js";
import StoreProduct from "../../models/StoreProduct.js"; // If you have a StoreProduct model

// Sales trend for storekeeper
export const generateSalesTrendReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const match = {};
    if (start && end) {
      match.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }
    const salesTrend = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(salesTrend);
  } catch (e) {
    res.status(500).json({ message: "Failed to generate sales trend report" });
  }
};

export const generateInventoryReport = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("_id userName email");
    const sellersWithProducts = await Promise.all(
      sellers.map(async (seller) => {
        // Find all StoreProduct entries for this seller
        const storeProducts = await StoreProduct.find({ seller: seller._id }).populate("product");
        const products = storeProducts
          .filter(sp => sp.product)
          .map(sp => ({
            _id: sp.product._id,
            title: sp.product.title,
            totalStock: sp.product.totalStock,
            lowStockThreshold: sp.product.lowStockThreshold,
            image: sp.product.image
          }));
        return {
          _id: seller._id,
          userName: seller.userName,
          email: seller.email,
          products
        };
      })
    );
    res.json(sellersWithProducts);
  } catch (e) {
    console.error("Inventory report error:", e);
    res.status(500).json({ message: "Failed to generate inventory report" });
  }
};