import express from "express";
import { buyBook } from "../controllers/orderController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/buy",
  protect,
  allowRoles("user"), // 👈 only users can buy
  buyBook
);

export default router;
