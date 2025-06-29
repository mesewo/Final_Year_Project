import Feedback from "../../models/Feedback.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

export const submitFeedback = async (req, res) => {
  // console.log("FEEDBACK BODY:", req.body);
  try {
    const { userId, orderId, productId, userName,  rating, comment, type } = req.body;

    // Verify the user has purchased the product
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
      $or: [
          { "cartItems.productId": productId },
          { "orderItems.productId": productId }
      ],
      orderStatus: { $in: ["delivered", "approved", "confirmed"] }
    });

    console.log("Feedback check:", {
      orderId,
      userId,
      productId,
      foundOrder: order
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase and try this product to leave feedback.",
      });
    }

    // Check if the user has already left feedback for this product
    const existingFeedback = await Feedback.findOne({
      product: productId,
      user: userId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You already left feedback for this product!",
      });
    }

    const feedback = new Feedback({
      user: userId,
      product: productId,
      order: orderId,
      userName,
      rating,
      comment,
      type: type || "product",
      // status defaults to "pending"
    });

    await feedback.save();

    // Calculate the average rating for the product (only approved feedback)
    const feedbacks = await Feedback.find({ product: productId, status: "approved" });
    const totalFeedbacksLength = feedbacks.length;
    const averageReview =
      totalFeedbacksLength > 0
        ? feedbacks.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) / totalFeedbacksLength
        : 0;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    // Get userId from query or body (adjust as needed)
    const userId = req.query.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const feedback = await Feedback.find({ user: userId }).populate(
      "product",
      "title image"
    );

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductFeedback = async (req, res) => {
  try {
    const { productId } = req.params;
    const feedbacks = await Feedback.find({ product: productId, status: "approved" });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const { storeId } = req.query;
    let filter = { status: "approved" };

    if (storeId) {
      const products = await Product.find({ storeId }).select("_id");
      filter.product = { $in: products.map((p) => p._id.toString()) };
    }

    // Use .lean() to get plain JS objects
    const feedbacks = await Feedback.find(filter).lean();
    // Convert product field to string for all feedbacks
    feedbacks.forEach(fb => {
      if (fb.product && typeof fb.product !== "string") {
        fb.product = fb.product.toString();
      }
    });

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  submitFeedback,
  getMyFeedback,
  getProductFeedback,
  getAllFeedback,
};