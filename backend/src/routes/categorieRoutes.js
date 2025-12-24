import exportss from "express";
import {
  getAllCategorie,
  getCategorie,
  createCategorie,
  updateCatagorie,
  deleteCategorie,
} from "../controllers/categoriesController.js";
const router = exportss.Router();
//TODO: get book base on categorie, top categories
// TODO: update book count in categorie when book is added or removed
router.get("/", getAllCategorie);
router.get("/:identifier", getCategorie);
router.put("/update/:id", updateCatagorie);
router.delete("/delete/:id", deleteCategorie);
router.post("/create", createCategorie);
export default router;
