// server/models/Notification.js
import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  type: String,
  message: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  forRole: String,
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Notification", notificationSchema);