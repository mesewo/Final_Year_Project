import express from "express";
import {
  updateSellerUsername,
  updateSellerPassword,
} from "../../controllers/seller/settings-controller.js";

const router = express.Router();

router.put("/update-username", updateSellerUsername);
router.put("/update-password", updateSellerPassword);

export default router;