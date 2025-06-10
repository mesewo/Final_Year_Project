import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  orderItems: [orderItemSchema],
  type: { type: String, enum: ["normal", "bulk"], default: "normal" },  
  tx_ref: { type: String },
  storekeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  store: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Store",
  },
  isQRVerified: {
    type: Boolean,
    default: false,
  },

  addressInfo: {
    addressId: { type: mongoose.Schema.Types.ObjectId },
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderStatus: { type: String, default: "pending" },
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: "pending" },
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
}, {
  timestamps: true,
});

// Prevent OverwriteModelError in dev
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
