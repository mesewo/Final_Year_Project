// backend/routes/payment.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";



dotenv.config();
const router = express.Router();
// console.log("CHAPA_SECRET_KEY:", process.env.CHAPA_SECRET_KEY);

// backend/routes/payment.js

router.post("/initiate", async (req, res) => {
  try {
    const { amount, email, first_name, last_name, tx_ref, orderId, return_url } = req.body;


    console.log("Received payment initiation:", req.body);
    console.log("CHAPA_SECRET_KEY:", process.env.CHAPA_SECRET_KEY);

    // Check for required fields
    // if (!amount || !email || !first_name || !last_name || !tx_ref || !orderId) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email,
        first_name,
        last_name,
        tx_ref, // your unique tx_ref
        orderId,
        return_url: `http://localhost:5173/shop/payment-static-success?from=chapa`,
        //  // only orderId here
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    // res
      // .status(500)
      // .json({ message: "Chapa Init Error", error: error?.response?.data });
      // Log everything for debugging
    console.error("Chapa Init Error:", {
      message: error.message,
      response: error.response?.data,
      request: error.config?.data,
    });
    res.status(error.response?.status || 500).json({
      message: "Chapa Init Error",
      error: error.response?.data || error.message,
    });
  }
});

export default router;
