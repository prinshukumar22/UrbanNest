import express from "express";

import { postSignup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", postSignup);

export default router;
