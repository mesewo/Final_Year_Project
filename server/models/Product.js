import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["men", "women", "kids"],
  },
  brand: {
    type: String,
    required: true,
    default: "ABAY",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: "Sale price must be less than regular price",
    },
  },
  totalStock: {
    type: Number,
    required: true,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
  },
  soldCount: {
    type: Number,
    default: 0,
  },
  averageReview: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Prevent model overwrite error in development
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);