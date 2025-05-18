import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Optionally, add order or type if needed
    // order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    // type: { type: String, enum: ["product", "service", "general"], default: "product" },
    response: {
      text: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);