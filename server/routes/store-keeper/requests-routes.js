import express from "express";
import ProductRequest from "../../models/ProductRequest.js"; // adjust path if needed
import { storekeeperAuthMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.patch("/requests/:id/revert", storekeeperAuthMiddleware, async (req, res) => {
  try {
    const request = await ProductRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });
    if (request.status !== "rejected")
      return res.status(400).json({ message: "Only rejected requests can be reverted" });
    request.status = "pending";
    await request.save();
    res.json({ message: "Request reverted to pending" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;