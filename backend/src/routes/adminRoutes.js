import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAlladmin,
  getAdmin,
  createadmin,
  loginadmin,
  getAdminDashboardOverview,
  getTopPerformingBooks,
  getAdminSalesOverview,
  getUserSignupsOverTime,
  getSellerSignupsOverTime,
  getAdminUsersTable,
  getAdminSellersTable,
  getAdminOrdersTable,
  adminDeleteUser,
  adminDeleteSeller,
  adminDeleteOrders,
  adminCreateUser,
  adminUpdateUser,
  adminCreateSeller,
  adminUpdateSeller,
  updateAdminProfile,
  changeAdminPassword,
  getAdminAdminsTable,
  adminDeleteAdmin,
  exportAdmins,
} from "../controllers/adminController.js";
import { protect, allowRoles } from "../middlewares/auth.js";
// TODO: admin history, stats,
const router = express.Router();
/**
 * ! For Testing Purposes Only
 **/
// TODO: Total Book,Salles,Total user,revenue stats
// TODO: Download Reports (7day,30day,alltime)
// TODO: new VS returning users
// TODO: active users
// TODO: Total Sellers,Total order,new Customers,avrg order value (RS)
// TODO: reset password

router.get(
  "/",
  protect,
  //  allowRoles("admin"),
  getAlladmin,
);
router.get("/profile", protect, allowRoles("admin"), (req, res) => {
  res.json({
    role: req.role,
    user: req.user,
  });
});

// Settings: Edit Profile & Security
router.put(
  "/settings/profile",
  protect,
  allowRoles("admin"),
  upload.single("ppadmin"),
  updateAdminProfile,
);
router.put(
  "/settings/password",
  protect,
  allowRoles("admin"),
  changeAdminPassword,
);
router.get(
  "/dashboard/overview",
  protect,
  allowRoles("admin"),
  getAdminDashboardOverview,
);

router.get(
  "/dashboard/sales-overview",
  protect,
  allowRoles("admin"),
  getAdminSalesOverview,
);

// Top performing books
router.get(
  "/dashboard/top-books",
  protect,
  allowRoles("admin"),
  getTopPerformingBooks,
);

// User & Seller signup analytics
router.get(
  "/dashboard/user-signups",
  protect,
  allowRoles("admin"),
  getUserSignupsOverTime,
);

router.get(
  "/dashboard/seller-signups",
  protect,
  allowRoles("admin"),
  getSellerSignupsOverTime,
);

// Users & Sellers tables for admin
router.get(
  "/dashboard/users",
  protect,
  allowRoles("admin"),
  getAdminUsersTable,
);

router.get(
  "/dashboard/sellers",
  protect,
  allowRoles("admin"),
  getAdminSellersTable,
);

router.delete(
  "/dashboard/users/:id",
  protect,
  allowRoles("admin"),
  adminDeleteUser,
);

router.delete(
  "/dashboard/sellers/:id",
  protect,
  allowRoles("admin"),
  adminDeleteSeller,
);

router.get(
  "/dashboard/orders",
  protect,
  allowRoles("admin"),
  getAdminOrdersTable,
);

router.delete(
  "/dashboard/orders",
  protect,
  allowRoles("admin"),
  adminDeleteOrders,
);

router.post(
  "/dashboard/users",
  protect,
  allowRoles("admin"),
  adminCreateUser,
);

router.put(
  "/dashboard/users/:id",
  protect,
  allowRoles("admin"),
  adminUpdateUser,
);

router.post(
  "/dashboard/sellers",
  protect,
  allowRoles("admin"),
  adminCreateSeller,
);

router.put(
  "/dashboard/sellers/:id",
  protect,
  allowRoles("admin"),
  adminUpdateSeller,
);

// Settings: Add Admin (list, create, delete, export)
router.get(
  "/dashboard/admins/export",
  protect,
  allowRoles("admin"),
  exportAdmins,
);
router.get(
  "/dashboard/admins",
  protect,
  allowRoles("admin"),
  getAdminAdminsTable,
);
router.post(
  "/dashboard/admins",
  protect,
  allowRoles("admin"),
  upload.single("ppadmin"),
  createadmin,
);
router.delete(
  "/dashboard/admins/:id",
  protect,
  allowRoles("admin"),
  adminDeleteAdmin,
);

router.get(
  "/:id",
  protect,
  //  allowRoles("admin"),
  getAdmin,
);

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
