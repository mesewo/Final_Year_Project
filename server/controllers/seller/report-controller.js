import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

export const generateSellerSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sellerId = req.user.id;

    const report = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          "cartItems.productId": { $exists: true },
        },
      },
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $match: { "productDetails.seller": sellerId } },
      {
        $group: {
          _id: "$productDetails._id",
          productName: { $first: "$productDetails.title" },
          totalSold: { $sum: "$cartItems.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$cartItems.quantity", "$cartItems.price"],
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  generateSellerSalesReport,
};