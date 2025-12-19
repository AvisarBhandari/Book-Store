import express from "express";
import upload from "../middlewares/upload.js";
import {
  getAllBooks,
  createBook,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";
import filterBooks from "../controllers/filter.js";

const router = express.Router();

router.get("/", getAllBooks);

// Filter
router.get("/filterBooks", filterBooks);

router.post(
  "/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  createBook
);
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
