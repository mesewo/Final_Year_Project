import mongoose from "mongoose";
import StoreProduct from "../models/StoreProduct.js"; // Adjust path as needed

const MONGO_URI = "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your URI

const storeSellerMap = {
  "682ccdd83de974f948889f1f": "681a74a3fd428d08c1c522d5", // maraki
  "682ccde53de974f948889f23": "681f93c415ca51bd6155bcf1", // azezo
};

async function fixStoreProductSellers() {
  await mongoose.connect(MONGO_URI);

  for (const [storeId, sellerId] of Object.entries(storeSellerMap)) {
    const result = await StoreProduct.updateMany(
      { store: storeId },
      { $set: { seller: sellerId } }
    );
    console.log(
      `Updated ${result.modifiedCount} StoreProduct(s) for store ${storeId} to seller ${sellerId}`
    );
  }

  await mongoose.disconnect();
}

fixStoreProductSellers().catch((err) => {
  console.error(err);
  process.exit(1);
});