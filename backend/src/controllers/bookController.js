import Book from "../models/book.js";
import Order from "../models/order.js";
import fs from "fs";
import path from "path";
import { similarityScore } from "../algorithem/fuzzySearch.js";

export async function getAllBooks(req, res) {
  try {
    const { category, categoryId, author } = req.query;
    const filter = { status: "approved" };
    if (category) filter.category = new RegExp(`^${category}$`, "i");
    if (categoryId) filter.categoryID = categoryId;
    if (author) filter.author = new RegExp(`^${author}$`, "i");
    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export async function downloadBook(req, res) {
  try {
    const rawId = req.params.id;
    const id = rawId ? String(rawId).split('?')[0].trim() : null;
    if (!id) return res.status(400).json({ message: "Book id required" });
    const userId = req.user._id;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const purchased = await Order.findOne({
      user: userId,
      book: id,
      paymentStatus: "paid",
    });
    if (!purchased) {
      return res.status(403).json({ message: "Purchase required to download" });
    }

    const filePath = path.isAbsolute(book.bookFile)
      ? book.bookFile
      : path.join(path.resolve(), book.bookFile);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    const filename = path.basename(book.bookFile) || `${book.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export const createBook = async (req, res) => {
  try {
    // Debug
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

    const {
      title,
      author,
      description,
      price,
      discountPercentage,
      genres,
      category,
      categoryID,
      seller,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !author ||
      !description ||
      !price ||
      !category ||
      !categoryID
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author, description, price, seller, category, and categoryID are required",
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

    // Normalize genres: accept both comma‑separated string and array
    let normalizedGenres = [];
    if (Array.isArray(genres)) {
      normalizedGenres = genres;
    } else if (typeof genres === "string" && genres.trim().length > 0) {
      normalizedGenres = genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);
    }

    // Create book document
    const book = new Book({
      title,
      author,
      description,
      price: Number(price),
      discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
      genres: normalizedGenres,
      seller,
      category,
      categoryID,
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
    const {
      title,
      author,
      description,
      category,
      categoryID,
      price,
      discountPercentage,
      genres,
      seller,
      ratings,
      reviewCount,
    } = req.body;

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

    // Normalize genres on update: allow array or string, ignore if undefined
    if (genres !== undefined) {
      if (Array.isArray(genres)) {
        book.genres = genres;
      } else if (typeof genres === "string" && genres.trim().length > 0) {
        book.genres = genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
      } else {
        book.genres = [];
      }
    }
    if (seller) book.seller = seller;

    // Accept both category/category naming, and preserve existing when not provided
    const resolvedCategory = category || category || book.category;
    const resolvedCategoryID = categoryID || categoryID || book.categoryID;

    book.category = resolvedCategory;
    book.categoryID = resolvedCategoryID;
    if (ratings) book.ratings = Number(ratings);
    if (reviewCount) book.reviewCount = Number(reviewCount);

    // If category data is still missing, fail fast with a clear message
    if (!book.category || !book.categoryID) {
      return res.status(400).json({
        success: false,
        message: "category and categoryID are required",
      });
    }

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
