import mongoose from "mongoose";
import StoreProduct from "../models/StoreProduct.js"; // Adjust path as needed

const MONGO_URI = "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your URI

async function updateStoreIds() {
  await mongoose.connect(MONGO_URI);

  // Map of old storeId to new storeId
  const storeIdMap = {
    "6828c2674ad83ca75331ee43": "682ccdd83de974f948889f1f",
    "6828c27b4ad83ca75331ee47": "682ccde53de974f948889f23",
  };

  for (const [oldId, newId] of Object.entries(storeIdMap)) {
    const result = await StoreProduct.updateMany(
      { store: oldId },
      { $set: { store: newId } }
    );
    console.log(`Updated ${result.modifiedCount} documents from ${oldId} to ${newId}`);
  }

  await mongoose.disconnect();
}

updateStoreIds().catch(err => {
  console.error(err);
  process.exit(1);
});