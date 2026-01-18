import mongoose from "mongoose";
import book from "./book.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true }
);
export async function updateBookCount(categoryId) {
  try {
    const bookCount = await book.countDocuments({ categoryID: categoryId });
    await category.findByIdAndUpdate(categoryId, { bookCount });
  } catch (error) {
    console.error("Error updating book count:", error);
  }
}

const Category = mongoose.model("Category", categorySchema);
export default Category;
