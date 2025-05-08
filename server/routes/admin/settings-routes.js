import express from "express";
import {
  getAllSettings,
  updateSetting,
  addSetting,
  deleteSetting,
} from "../../controllers/admin/settings-controller.js";

const router = express.Router();

// Route to get all settings
router.get("/", getAllSettings);

// Route to update a specific setting
router.put("/update/:id", updateSetting);

// Route to add a new setting
router.post("/add", addSetting);

// Route to delete a specific setting
router.delete("/delete/:id", deleteSetting);

export default router;