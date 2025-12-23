import Categorie from "../models/Categorie.js";
import mongoose from "mongoose";

export async function getAllCategorie(req, res) {
  try {
    const categories = await Categorie.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const getCategorie = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Categorie id or name is required",
      });
    }

    let categorie;

    // If valid MongoDB ObjectId → search by _id
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      categorie = await Categorie.findById(identifier);
    } else {
      // Case-insensitive name search
      categorie = await Categorie.findOne({
        name: { $regex: `^${identifier}$`, $options: "i" },
      });
    }

    if (!categorie) {
      return res.status(404).json({
        success: false,
        message: "Categorie not found",
      });
    }

    res.status(200).json({
      success: true,
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export async function deleteCategorie(req, res) {
  try {
    const { id, name } = req.params;

    if (!id && !name) {
      return res
        .status(400)
        .json({ message: "Categorie ID or name is required" });
    }

    if (name) {
      const categorieByName = await Categorie.findOneAndDelete({ name: name });
      if (!categorieByName) {
        return res.status(404).json({ message: "Categorie not found" });
      }
      return res
        .status(200)
        .json({ message: "Categorie deleted successfully" });
    }

    const categorie = await Categorie.findByIdAndDelete(id);
    if (!categorie) {
      return res.status(404).json({ message: "Categorie not found" });
    }

    res.status(200).json({ message: "Categorie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export async function updateCatagorie(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Categorie ID is required" });
    }
    const categorie = await Categorie.findById(id);
    if (!categorie) {
      return res.status(404).json({ message: "Categorie not found" });
    }
    categorie.name = name || categorie.name;
    categorie.description = description || categorie.description;
    await categorie.save();
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export async function createCategorie(req, res) {
  try {
    const { name, description } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }
    const trimmedName = name.trim();
    const existingCategorie = await Categorie.findOne({ name: trimmedName });
    if (existingCategorie) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const newCategorie = await Categorie.create({
      name: trimmedName,
      description,
    });
    res.status(201).json(newCategorie);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
