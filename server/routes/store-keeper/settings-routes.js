import express from "express";
import {
  updateStorekeeperUsername,
  updateStorekeeperPassword,
} from "../../controllers/store-keeper/settings-controller.js";

const router = express.Router();

router.put("/update-username", updateStorekeeperUsername);
router.put("/update-password", updateStorekeeperPassword);

export default router;