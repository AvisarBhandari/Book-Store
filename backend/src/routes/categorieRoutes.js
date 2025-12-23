import exportss from "express";
import {
  getAllCategorie,
  getCategorie,
  createCategorie,
  updateCatagorie,
  deleteCategorie,
} from "../controllers/categoriesController.js";
const router = exportss.Router();

router.get("/", getAllCategorie);
router.get("/:identifier", getCategorie);
router.put("/update/:id", updateCatagorie);
router.delete("/delete/:id", deleteCategorie);
router.post("/create", createCategorie);
export default router;
