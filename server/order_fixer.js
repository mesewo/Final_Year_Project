import mongoose from "mongoose";
import Order from "../server/models/Order.js";
import StoreProduct from "../server/models/StoreProduct.js"; // You may need to create this model if not present

const MONGO_URI = "mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // <-- Change this

// Helper to pick a random element from an array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await mongoose.connect(MONGO_URI);

  // Build a map: productId -> [{store, seller}]
  const storeProducts = await StoreProduct.find({});
  const productMap = {};
  for (const sp of storeProducts) {
    const pid = sp.product.toString();
    if (!productMap[pid]) productMap[pid] = [];
    productMap[pid].push({ store: sp.store, seller: sp.seller });
  }

  const orders = await Order.find({});
  for (const order of orders) {
    // Use orderItems if present, else cartItems
    const items = (order.orderItems && order.orderItems.length > 0)
      ? order.orderItems
      : (order.cartItems || []);

    // Collect all possible (store, seller) pairs for this order
    let pairs = [];
    for (const item of items) {
      const pid = item.productId?.toString();
      if (productMap[pid]) {
        pairs.push(...productMap[pid]);
      }
    }

    if (pairs.length === 0) continue; // Can't assign if no mapping

    // If all stores/sellers are the same, use that. Else pick randomly.
    const uniqueStores = [...new Set(pairs.map(p => p.store.toString()))];
    const uniqueSellers = [...new Set(pairs.map(p => p.seller.toString()))];

    let store, seller;
    if (uniqueStores.length === 1 && uniqueSellers.length === 1) {
      store = uniqueStores[0];
      seller = uniqueSellers[0];
    } else {
      const randomPair = pickRandom(pairs);
      store = randomPair.store;
      seller = randomPair.seller;
    }

    // Only update if missing or different
    let needsUpdate = false;
    if (!order.store || order.store.toString() !== store.toString()) {
      order.store = store;
      needsUpdate = true;
    }
    if (!order.seller || order.seller.toString() !== seller.toString()) {
      order.seller = seller;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await order.save();
      console.log(`Updated order ${order._id} with store ${store} and seller ${seller}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});