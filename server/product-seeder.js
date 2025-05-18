import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

// Load env variables
dotenv.config();

// Replace with an actual seller ID from your Users collection
const SELLER_ID = "681a74a3fd428d08c1c522d5"; // e.g., "663d2c85e18b221b460e823a"

const start = async () => {
  try {
    await mongoose.connect("mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected to MongoDB");

    const productResult = await Product.updateMany(
      { seller: { $exists: false } }, // or remove if you want to override all
      { $set: { seller: new mongoose.Types.ObjectId(SELLER_ID) } }
    );

    const orderResult = await Order.updateMany(
      { seller: { $exists: false } }, // optional filter
      { $set: { seller: new mongoose.Types.ObjectId(SELLER_ID) } }
    );

    console.log(`Updated ${productResult.modifiedCount} products`);
    console.log(`Updated ${orderResult.modifiedCount} orders`);
  } catch (err) {
    console.error("Backfill Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

start();
