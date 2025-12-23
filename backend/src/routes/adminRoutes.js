import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAlladmin,
  getAdmin,
  createadmin,
  loginadmin,
} from "../controllers/adminController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();
router.get("/", protect, allowRoles("admin"), getAlladmin);
router.get("/:id", protect, allowRoles("admin"), getAdmin);
router.get("/profile", protect, allowRoles("admin"), (req, res) => {
  res.json({
    role: req.role,
    user: req.user,
  });
});
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
  });
  res.status(200).json({ message: "Logged out successfully" });
});
router.post("/create", upload.single("ppadmin"), createadmin);
router.post("/login", loginadmin);
export default router;
