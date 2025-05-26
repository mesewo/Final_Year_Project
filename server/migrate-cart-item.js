import mongoose from "mongoose";
import Cart from "../server/models/Cart.js";
import StoreProduct from "../server/models/StoreProduct.js";

const MONGO_URI = "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Change this

async function migrate() {
  await mongoose.connect(MONGO_URI);

  const carts = await Cart.find({});
  for (const cart of carts) {
    let updated = false;
    for (const item of cart.items) {
      // Only update if missing
      if (!item.storeId || !item.sellerId) {
        const storeProduct = await StoreProduct.findOne({ product: item.productId });
        if (storeProduct) {
          item.storeId = storeProduct.store;
          item.sellerId = storeProduct.seller;
          updated = true;
        }
      }
    }
    if (updated) {
      await cart.save();
      console.log(`Updated cart ${cart._id}`);
    }
  }

  await mongoose.disconnect();
  console.log("Migration complete.");
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});