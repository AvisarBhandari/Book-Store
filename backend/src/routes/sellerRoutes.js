import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAllSeller,
  createSeller,
  loginSeller,
} from "../controllers/sellerController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();

// protected seller profile
router.get("/profile", protect, allowRoles("seller"), (req, res) => {
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

router.get("/", getAllSeller);
router.post("/create", upload.single("ppseller"), createSeller);
router.post("/login", loginSeller);

export default router;
