import express from "express";
import upload from "../middlewares/ppUpload.js";
import {getAllSeller,createSeller} from "../controllers/sellerController.js";

const router = express.Router();

router.get("/", getAllSeller);
router.post("/create", upload.single("ppseller"), createSeller);
export default router;
