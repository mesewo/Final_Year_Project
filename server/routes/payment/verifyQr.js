import express from "express";
import Order from "../../models/Order.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { ref } = req.query;

  if (!ref) return res.status(400).json({ error: "Missing payment reference" });

  try {
    const order = await Order.findOne({ paymentId: ref });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      orderId: order._id,
      paid: order.paymentStatus === "paid",
      items: order.orderItems,
      isQRVerified: order.isQRVerified,
      paidAt: order.paymentPaidAt,
      userId: order.userId,
      store: order.store,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching order" });
  }
});

// Optionally, add a POST route to mark order as QR verified by the branch staff
router.post("/verify", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) return res.status(400).json({ error: "Missing order ID" });

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.isQRVerified = true;
    await order.save();

    res.json({ message: "Order marked as verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error updating order" });
  }
});

export default router;
