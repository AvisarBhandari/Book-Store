import express from "express";
import {
  createOrUpdateReview,
  getBookReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post(
  "/set-review",
  protect,
  allowRoles("user", "admin", "seller"),
  createOrUpdateReview,
);

router.get("/:bookId", getBookReviews);
router.delete("/:id", deleteReview);

export default router;
