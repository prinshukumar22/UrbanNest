import express from "express";

import {
  createListing,
  getListings,
  deleteListing,
  updateListing,
  getListing,
  getAllListings,
} from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/getlistings/:userId", verifyToken, getListings);
router.delete("/deletelisting/:listingId", verifyToken, deleteListing);
router.put("/update/:listingId", verifyToken, updateListing);
router.get("/get/:listingId", getListing);
router.get("/get", getAllListings);

export default router;
