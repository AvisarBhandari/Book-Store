import express from "express";
import upload from "../middlewares/upload.js";
import {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";

const router = express.Router();
//TODO: reviews and ratings
//TODO: search functionality, implement algorithms
//TODO: recommendations based on user behavior
//TODO: total book,sold,revenue for sellers
//TODO: update book details
router.get("/", getAllBooks);

router.post(
  "/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  createBook
);
router.get("/:id", getBookById);
router.put(
  "/update/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  updateBook
);
router.delete("/delete/:id", deleteBook);
export default router;
