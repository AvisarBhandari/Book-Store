import express from "express";
import upload from "../middlewares/ppUpload.js";
import {
  getAlladmin,
  createadmin,
  loginadmin,
} from "../controllers/adminController.js";

const router = express.Router();
router.get("/", getAlladmin);
router.post("/create", upload.single("ppadmin"), createadmin);
router.post("/login", loginadmin);
export default router;
