// add-stores.js
import mongoose from "mongoose";
import Store from "../models/Store.js"; // Adjust the path as needed

// 1. Replace with your MongoDB connection string
const MONGO_URI = "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const storesToAdd = [
  { name: "Central Store", location: "Addis Ababa" },
  { name: "North Branch", location: "Bahir Dar" },
  { name: "South Branch", location: "Hawassa" },
  // Add more stores as needed
];

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const result = await Store.insertMany(storesToAdd);
    console.log("Stores added:", result);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error adding stores:", err);
    process.exit(1);
  }
}

main();