import express from "express";
import {
  getAllUsers,
  blockUser,
  unblockUser,
} from "../../controllers/admin/user-controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);

export default router;