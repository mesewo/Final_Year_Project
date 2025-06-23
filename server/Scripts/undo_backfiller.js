import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const startUndo = async () => {
  try {
    await mongoose.connect("mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected to MongoDB");

    const productUndoResult = await Product.updateMany(
      { seller: { $exists: true } }, // Target documents with the 'seller' field
      { $unset: { seller: 1 } }      // Remove the 'seller' field
    );

    const orderUndoResult = await Order.updateMany(
      { seller: { $exists: true } }, // Target documents with the 'seller' field
      { $unset: { seller: 1 } }      // Remove the 'seller' field
    );

    console.log(`Removed 'seller' field from ${productUndoResult.modifiedCount} products`);
    console.log(`Removed 'seller' field from ${orderUndoResult.modifiedCount} orders`);
  } catch (err) {
    console.error("Undo Backfill Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

startUndo();