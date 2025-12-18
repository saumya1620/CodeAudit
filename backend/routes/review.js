import express from "express";
import { createReview, getReviews } from "../controllers/review.js";
import authmiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authmiddleware, createReview);
router.get("/", authmiddleware, getReviews);

export default router;
