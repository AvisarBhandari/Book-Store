import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAllSeller,
  createSeller,
  loginSeller,
  deleteSeller,
  updateSeller,
} from "../controllers/sellerController.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();
//TODO: stats,get books by seller, Today sales, total sales
// TODO: update seller profile pic,
// TODO: sales over time
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
router.post("/login", loginSeller);
router.put("/update", protect, allowRoles("seller", "admin"), updateSeller);
router.get("/", getAllSeller);
router.post("/create", upload.single("ppseller"), createSeller);
router.delete("/delete", protect, allowRoles("seller", "admin"), deleteSeller);

export default router;
