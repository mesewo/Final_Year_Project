import mongoose from "mongoose";

const BulkCartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // storeId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Store",
        // },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    isBulk: {
      type: Boolean,
      default: true, // Always true for bulk cart
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BulkCart", BulkCartSchema);