import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAllSeller,
  createSeller,
  loginSeller,
  deleteSeller,
  updateSeller,
  getSellerDashboardOverview,
  getTopPerformingBooks,
  getSellerBooks,
  deleteBook,
  exportSellerBooks,
  changePassword,
  resetPassword,
} from "../controllers/sellerController.js";
import {
  protect,
  allowRoles,
  forgotPassword,
  forgotPasswordLimiter
} from "../middlewares/auth.js";

const router = express.Router();

// PROFILE
router.get("/profile", protect, allowRoles("seller"), (req, res) => {
  res.json({ role: req.role, user: req.user });
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

router.put("/change-password", protect, allowRoles("seller"), changePassword);
// AUTH & CRUD
router.post("/login", loginSeller);
router.put(
  "/update",
  protect,
  allowRoles("seller", "admin"),
  upload.single("ppseller"),
  updateSeller,
);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/", getAllSeller);
router.post("/create", upload.single("ppseller"), createSeller);
router.delete("/delete", protect, allowRoles("seller", "admin"), deleteSeller);

// DASHBOARD
router.get(
  "/dashboard/overview",
  protect,
  allowRoles("seller"),
  getSellerDashboardOverview,
);
router.get(
  "/dashboard/top-books",
  protect,
  allowRoles("seller"),
  getTopPerformingBooks,
);

// SELLER BOOKS
router.get("/:sellerId/books", protect, allowRoles("seller"), getSellerBooks);
router.delete("/books/:bookId", protect, allowRoles("seller"), deleteBook);
router.get(
  "/:sellerId/books/export",
  protect,
  allowRoles("seller"),
  exportSellerBooks,
);

export default router;
