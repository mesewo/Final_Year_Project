import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["product", "service", "general"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "archived"],
    default: "pending",
  },
  response: {
    text: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    respondedAt: Date,
  },
}, { timestamps: true });

export default mongoose.model("Feedback", FeedbackSchema);