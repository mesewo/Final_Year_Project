import express from "express";
import {
  getAllFeedback,
  updateFeedbackStatus,
  getFeedbackDetails,
} from "../../controllers/factman/feedback-controller.js";

const router = express.Router();

// Route to get all feedback
router.get("/", getAllFeedback);
router.get("/:id", getFeedbackDetails);
// Route to update feedback status
router.patch("/:id/status", updateFeedbackStatus);

export default router;