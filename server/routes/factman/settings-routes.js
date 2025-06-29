import express from "express";
import {
  updateFactmanUsername,
  updateFactmanPassword,
} from "../../controllers/factman/settings-controller.js";

const router = express.Router();

router.put("/update-username", updateFactmanUsername);
router.put("/update-password", updateFactmanPassword);

export default router;