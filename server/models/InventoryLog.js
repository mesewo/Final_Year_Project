import mongoose from "mongoose";

const InventoryLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  changeType: {
    type: String,
    enum: ["purchase", "sale", "adjustment", "return", "damage"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: String,
}, { timestamps: true });

export default mongoose.model("InventoryLog", InventoryLogSchema);