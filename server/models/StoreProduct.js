import mongoose from "mongoose";

const storeProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // <-- Add this line
  quantity: { type: Number, required: true },
  lastRestocked: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.StoreProduct || mongoose.model("StoreProduct", storeProductSchema);