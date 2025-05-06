import Feedback from "../../models/Feedback.js";
import Order from "../../models/Order.js";

export const submitFeedback = async (req, res) => {
  try {
    const { orderId, productId, rating, comment, type } = req.body;

    // Verify the user has purchased the product
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id,
      "cartItems.productId": productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can only review purchased products",
      });
    }

    const feedback = new Feedback({
      user: req.user.id,
      product: productId,
      order: orderId,
      rating,
      comment,
      type: type || "product",
    });

    await feedback.save();

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id }).populate(
      "product",
      "title image"
    );

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  submitFeedback,
  getMyFeedback,
};