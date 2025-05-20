import mongoose from "mongoose";
import StoreProduct from "../server/models/StoreProduct.js";
// import User from "../server/models/User.js";

// Replace with your actual MongoDB URI
const MONGODB_URI = "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Replace with your actual seller ObjectIds
const sellerIds = [
  "681a74a3fd428d08c1c522d5", // seller 1
  "681f93c415ca51bd6155bcf1"  // seller 2
];

async function assignSellers() {
  await mongoose.connect(MONGODB_URI);

  const storeProducts = await StoreProduct.find();
  for (const sp of storeProducts) {
    // Pick a random seller
    const randomSeller = sellerIds[Math.floor(Math.random() * sellerIds.length)];
    sp.seller = randomSeller;
    await sp.save();
    console.log(`Updated StoreProduct ${sp._id} with seller ${randomSeller}`);
  }

  await mongoose.disconnect();
  console.log("Done!");
}

assignSellers().catch(err => {
  console.error(err);
  process.exit(1);
});