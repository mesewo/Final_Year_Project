import express from "express";
import {
  addFeature,
  getAllFeatures,
  deleteFeature,
} from "../../controllers/admin/features-controller.js";

const router = express.Router();

// Route to add a new feature
router.post("/add", addFeature);

// Route to get all features
router.get("/get", getAllFeatures);

// Route to delete a feature by ID
router.delete("/delete/:id", deleteFeature);

export default router;