import express from "express";

import {
  updateUser,
  deleteUser,
  signOutUser,
  getUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/signout/:userId", verifyToken, signOutUser);
router.get("/:userId", verifyToken, getUser);

export default router;
