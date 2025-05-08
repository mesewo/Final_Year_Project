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
  addressInfo: {
    addressId: { type: mongoose.Schema.Types.ObjectId },
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
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

const Order = mongoose.model("Order", orderSchema);
export default Order;
