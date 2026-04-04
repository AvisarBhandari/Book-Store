import express from "express";
import {
  getAlluser,
  getUser,
  getPurchasedBook,
  createuser,
  loginuser,
  updateUser,
  deleteuser,
  getBookmarks,
  toggleBookmark,
  updateProfile,
  changePassword,
  resetPassword,
} from "../controllers/userController.js";
import upload from "../middlewares/ppUpload.js";
import {
  protect,
  allowRoles,
  forgotPasswordLimiter,
  UserforgotPassword,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/books/:id", getPurchasedBook);
router.get("/profile", protect, allowRoles("user"), (req, res) => {
  res.json({
    role: req.role,
    user: req.user,
  });
});
router.put(
  "/profile",
  protect,
  allowRoles("user"),
  upload.single("ppuser"),
  updateProfile,
);
router.put("/profile/password", protect, allowRoles("user"), changePassword);
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
  });
  res.status(200).json({ message: "Logged out successfully" });
});
router.delete("/delete/:id", deleteuser);
router.get(
  "/",
  // protect,
  // allowRoles("admin"),
  getAlluser,
);
router.post("/forgot-password", forgotPasswordLimiter, UserforgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/:identifier", getUser);
router.put("/update/:id", upload.single("ppuser"), updateUser);
router.post("/create", upload.single("ppuser"), createuser);
router.post("/login", loginuser);
// Get bookmarks for a user
router.get("/:userId/bookmarks", getBookmarks);

// Add/remove bookmark (requires login)
router.post("/bookmark", protect, allowRoles("user"), toggleBookmark);

export default router;
