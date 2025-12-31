import mongoose from "mongoose";
import book from "../models/book.js";

const categorieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] }, // <- add this
  },
  { timestamps: true }
);
export async function updateBookCount(categorieId) {
  try {
    const bookCount = await book.countDocuments({ categorie: categorieId });
    await Categorie.findByIdAndUpdate(categorieId, { bookCount });
  } catch (error) {
    console.error("Error updating book count:", error);
  }
}

const Categorie = mongoose.model("Categorie", categorieSchema);
export default Categorie;
