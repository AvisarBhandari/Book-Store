import express from "express";
import {
  createOrUpdateReview,
  getBookReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post(
  "/reviews",
  protect,
  allowRoles("user,admin,seller"),
  createOrUpdateReview
);
router.get("/books/:bookId/reviews", getBookReviews);
router.delete("/reviews/:id", deleteReview);

export default router;
