import Feedback from "../../models/Feedback.js";

// Get details of a specific feedback
export const getFeedbackDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id)
      .populate("user", "name email")
      .populate("product", "title");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Existing exports
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate("user", "name email")
      .populate("product", "title");

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow valid statuses
    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Recalculate average rating for the product if status is changed to approved or rejected
    if (feedback.product) {
      const FeedbackModel = feedback.constructor;
      const approvedFeedbacks = await FeedbackModel.find({
        product: feedback.product,
        status: "approved",
      });
      const total = approvedFeedbacks.length;
      const averageReview =
        total > 0
          ? approvedFeedbacks.reduce((sum, f) => sum + f.rating, 0) / total
          : 0;

      // Update the product's averageReview
      const Product = (await import("../../models/Product.js")).default;
      await Product.findByIdAndUpdate(feedback.product, { averageReview });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};