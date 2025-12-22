import express from "express";
import {
  getAlluser,
  getUser,
  createuser,
  loginuser,
} from "../controllers/userController.js";
import upload from "../middlewares/ppUpload.js";
const router = express.Router();

router.get("/", getAlluser);
router.get("/:id", getUser);
router.post("/create", upload.single("ppuser"), createuser);
router.post("/login", loginuser);

export default router;
