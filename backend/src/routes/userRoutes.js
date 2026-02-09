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
} from "../controllers/userController.js";
import upload from "../middlewares/ppUpload.js";
import { protect, allowRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/books/:id", getPurchasedBook);
router.get("/profile", protect, allowRoles("user"), (req, res) => {
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
router.delete("/delete/:id", deleteuser);
router.get(
  "/",
  // protect,
  // allowRoles("admin"),
  getAlluser,
);
router.get("/:identifier", getUser);
router.put("/update/:id", upload.single("ppuser"), updateUser);
router.post("/create", upload.single("ppuser"), createuser);
router.post("/login", loginuser);
// Get bookmarks for a user
router.get("/:userId/bookmarks", getBookmarks);

// Add/remove bookmark
router.post("/bookmark", toggleBookmark);

export default router;
