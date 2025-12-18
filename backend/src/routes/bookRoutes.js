import express from "express";
import {
  getAllBooks,
  bestSellerBooks,
  createBook,
  deleteBooks,
  updateBooks,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/bestsellers", bestSellerBooks);
router.post("/", createBook);
router.put("/:id", updateBooks);
router.delete("/:id", deleteBooks);
export default router;
