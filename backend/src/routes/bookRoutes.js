import express from "express";
import {
  getAllBooks,
  createBook,
  deleteBooks,
  updateBooks,
} from "../controllers/bookController.js";
import filterBooks from "../controllers/filter.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/", createBook);
router.put("/:id", updateBooks);
router.delete("/:id", deleteBooks);

router.get("/filterBooks", filterBooks);
export default router;
