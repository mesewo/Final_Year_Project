import express, { text } from "express";
import axios from "axios";
import Order from "../../models/Order.js";

const router = express.Router();

router.post("/verify", async (req, res) => {
  const { reference/*, orderId*/ } = req.body;

  if (!reference /*|| !orderId*/) {
    return res
      .status(400)
      .json({ error: "Missing payment reference" });
  }

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = response.data;

    if (data.status === "success" && data.data.status === "success") {
      // Update order payment status
      const order = await Order.findOne({tx_ref: reference/*, { orderId }*/});
      if (!order) return res.status(404).json({ error: "Order not found" });

      order.paymentStatus = "paid";
      order.paymentId = reference;
      order.paymentPaidAt = new Date();
      await order.save();

      return res.json({ message: "Payment verified and order updated" });
    } else {
      return res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error verifying payment" });
  }
});

export default router;
