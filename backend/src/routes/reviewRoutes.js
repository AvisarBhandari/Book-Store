import express from "express";
import {
  createOrUpdateReview,
  getBookReviews,
  deleteReview,
  canReview,
} from "../controllers/reviewController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post(
  "/set-review",
  protect,
  allowRoles("user", "admin", "seller"),
  createOrUpdateReview,
);
router.get(
  "/can-review/:bookId",
  protect,
  allowRoles("user", "admin", "seller"),
  canReview,
);

router.get("/:bookId", getBookReviews);
router.delete("/:id", deleteReview);

export default router;
