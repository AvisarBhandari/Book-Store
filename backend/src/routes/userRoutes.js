import express from "express";
import { getAlluser, createuser } from "../controllers/userController.js";
import upload from "../middlewares/ppUpload.js";
const router = express.Router();

router.get("/", getAlluser);
router.post("/create", upload.single("ppuser"), createuser);

export default router;
