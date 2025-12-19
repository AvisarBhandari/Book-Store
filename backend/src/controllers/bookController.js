import Book from "../models/book.js";

export async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


export async function createBook(req, res) {
  res.status(200).send("This is a book is created");
}
export async function updateBooks(req, res) {
  res.status(200).send("This is a book is updated");
}
export async function deleteBooks(req, res) {
  res.status(200).send("This is a book is deleted");
}
