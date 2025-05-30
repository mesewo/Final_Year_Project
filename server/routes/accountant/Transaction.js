import express from "express";
import ProductRequest from "../../models/ProductRequest.js"; // adjust path if needed

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Fetch all approved requests (or adjust filter as needed)
    const requests = await ProductRequest.find({ status: "approved" }).populate("storekeeper seller product");
    const transactions = requests.map(r => ({
      date: r.updatedAt || r.createdAt,
      storekeeper: r.storekeeper?.name || r.storekeeper, // adjust field as needed
      seller: r.seller?.userName || r.seller,
      product: r.product?.name || r.product,
      quantity: r.quantity,
      price: r.price,
    }));
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;