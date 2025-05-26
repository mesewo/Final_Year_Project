import express from "express";
import ProductRequest from "../../models/ProductRequest.js"; // adjust path if needed

const router = express.Router();

router.delete("/requests/:id", async (req, res) => {
  try {
    const request = await ProductRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be deleted" });
    }
    await request.deleteOne();
    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;