import express from "express";
import User from "../../models/User.js"; // adjust path as needed

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

export default router;