import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAlladmin,
  getAdmin,
  createadmin,
  loginadmin,
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
