import express from "express";
import upload from "../middlewares/upload.js";
import {
  getAllBooks,
  createBook,
  deleteBook,
  updateBook,
  fuzzySearchBooks,
  searchSuggestions,
} from "../controllers/bookController.js";
import filterBooks from "../controllers/filter.js";

const router = express.Router();
//TODO: reviews and ratings
//TODO: search functionality, implement algorithms
//TODO: recommendations based on user behavior
//TODO: total book,sold,revenue for sellers
//TODO: update book details
router.get("/", getAllBooks);

// Filter
router.get("/filterBooks", filterBooks);
router.get("/search/fuzzy", fuzzySearchBooks);
router.get("/search/suggestions", searchSuggestions);

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
