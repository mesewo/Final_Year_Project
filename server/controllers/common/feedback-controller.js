import Feedback from "../../models/Feedback.js";

export const getPublicFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ status: "approved" })
      .populate("user", "userName")
      .populate("product", "title image")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const feedback = new Feedback({
      user: req.user.id,
      product: productId,
      rating,
      comment,
      type: "product",
      status: "pending",
    });

    await feedback.save();

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  getPublicFeedback,
  submitFeedback,
};