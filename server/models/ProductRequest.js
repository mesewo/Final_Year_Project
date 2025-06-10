import mongoose from "mongoose";

const productRequestSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  quantity: { type: Number, required: true },
  isBulk: { type: Boolean, default: false },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "delivered"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.ProductRequest || mongoose.model("ProductRequest", productRequestSchema);
