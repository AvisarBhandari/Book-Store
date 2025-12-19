import Book from "../models/book.js";
import fs from "fs";
import path from "path";

export async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const createBook = async (req, res) => {
  try {
    // Debug: log incoming files & body
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

    const { title, author, description, price, discountPercentage, genres } =
      req.body;

    // Validate required fields
    if (!title || !author || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, author, description, and price are required",
      });
    }

    // Validate uploaded files
    if (
      !req.files ||
      !req.files.coverImage ||
      !req.files.bookFile ||
      req.files.coverImage.length === 0 ||
      req.files.bookFile.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cover image and book PDF are required",
      });
    }

    // Create book document
    const book = new Book({
      title,
      author,
      description,
      price: Number(price),
      discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
      genres: genres ? genres.split(",") : [],
      coverImage: req.files.coverImage[0].path,
      bookFile: req.files.bookFile[0].path,
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (err) {
    console.error("Create Book Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, price, discountPercentage, genres } =
      req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Update basic fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (price) book.price = Number(price);
    if (discountPercentage)
      book.discountPercentage = Number(discountPercentage);
    if (genres) book.genres = genres.split(",");

    // Delete previous files if new ones are uploaded
    if (req.files) {
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        // Delete old cover
        if (book.coverImage && fs.existsSync(book.coverImage)) {
          fs.unlinkSync(book.coverImage);
        }
        book.coverImage = req.files.coverImage[0].path;
      }

      if (req.files.bookFile && req.files.bookFile.length > 0) {
        // Delete old book PDF
        if (book.bookFile && fs.existsSync(book.bookFile)) {
          fs.unlinkSync(book.bookFile);
        }
        book.bookFile = req.files.bookFile[0].path;
      }
    }

    // Recalculate finalPrice
    book.finalPrice = book.price - (book.price * book.discountPercentage) / 100;

    await book.save();

    res.status(200).json({ success: true, message: "Book updated", book });
  } catch (err) {
    console.error("Update Book Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Delete cover image file
    if (book.coverImage && fs.existsSync(book.coverImage)) {
      fs.unlinkSync(book.coverImage);
    }

    // Delete book PDF file
    if (book.bookFile && fs.existsSync(book.bookFile)) {
      fs.unlinkSync(book.bookFile);
    }

    // Delete book from MongoDB
    await Book.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete Book Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

