import express from "express";
import {
  buyBook,
  getUserOrders,
  getSellerOrders,
  getOrderById,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/buy", protect, allowRoles("user"), buyBook);
router.get("/user/orders", protect, allowRoles("user"), getUserOrders);
router.get("/seller/orders", protect, allowRoles("seller"), getSellerOrders);
router.get(
  "/:id",
  protect,
  allowRoles("user", "seller", "admin"),
  getOrderById
);
router.get("/", protect, allowRoles("admin"), getAllOrders);

export default router;
