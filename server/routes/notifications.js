// server/routes/notifications.js
import express from "express";
import Notification from "../models/Notification.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const { forRole, type } = req.query;
  const notifications = await Notification.find({ forRole, type })
    .populate({
      path: "product",
      select: "title image"
    })
    .sort({ createdAt: -1 });
  res.json({ notifications });
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
});

export default router;