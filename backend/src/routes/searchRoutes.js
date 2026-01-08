import express from "express";
import { searchBooks, searchSuggestions } from "../controllers/search.js";
import { getFilterOptions, filterBooks } from "../controllers/filter.js";
const router = express.Router();

// Filter
router.get("/filter", filterBooks);
router.get("/filter/options", getFilterOptions);
// Search
router.get("/fuzzy", searchBooks);
router.get("/suggestions", searchSuggestions);

export default router;
