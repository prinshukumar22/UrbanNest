import express from "express";

import { postSignup, postSignIn } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", postSignup);
router.post("/signin", postSignIn);

export default router;
