import express from "express";
import { submitFeedback, getMyFeedback } from "../../controllers/shop/feedback-controller.js";


const router = express.Router();

// Route to submit feedback
router.post("/submit", submitFeedback);

// Route to get feedback submitted by the logged-in user
router.get("/my-feedback", getMyFeedback);

export default router;