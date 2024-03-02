import express from "express";

import {
  postSignup,
  postSignIn,
  googleSignIn,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", postSignup);
router.post("/signin", postSignIn);
router.post("/google", googleSignIn);

export default router;
