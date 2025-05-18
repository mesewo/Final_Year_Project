import express from "express";
import { authMiddleware } from "../../controllers/auth/auth-controller.js"; // Correct import path
import Chat from "../../models/Chat.js";

const router = express.Router();

// Protected chat routes
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({
      "participants.userId": req.user.id
    }).populate("participants.userId messages.sender");
    
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;