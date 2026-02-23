import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";

import { LuCloudDownload } from "react-icons/lu";
import AddBookMultiStep from "./AddBookMultiStep.jsx";
import swal from "sweetalert";
import {
  NameValidation,
  PriceValidation,
  DiscountValidation,
  BookNameValidation,
  DescriptionValidation,
  BookFileValidation,
  CoverImageValidation,
} from "../../utils/validation";

const formatPrice = (price) =>
  price
    ? "Rs. " +
      Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 })
    : "Rs. 0.00";

const SellerBookTable = ({ sellerId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewBook, setViewBook] = useState(null);
  const [editBookModalOpen, setEditBookModalOpen] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    discountPercentage: "",
    genres: "",
    coverImage: null,
    bookFile: null,
  });
  const [editBookData, setEditBookData] = useState({
    title: "",
    description: "",
    price: "",
    coverImage: null,
    bookFile: null,
    author: "",
    discountPercentage: "",
  });
  // Fetch books
  const fetchBooks = async () => {
    if (!sellerId) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5001/api/seller/${sellerId}/books`,
        { withCredentials: true },
      );
      const normalized = (res.data.data || res.data.books || []).map((b) => ({
        ...b,
        _id: b._id || b.id,
      }));
      setBooks(normalized);
    } catch (err) {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/categorie", {
          withCredentials: true,
        });
        setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [sellerId]);

  const handleDelete = async (bookId) => {
    if (!bookId) return;

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, this book cannot be recovered!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      await axios.delete(`http://localhost:5001/api/book/delete/${bookId}`, {
        withCredentials: true,
      });

      setBooks((prev) => prev.filter((b) => b._id !== bookId));

      swal("Deleted!", "The book has been deleted.", "success");
    } catch (err) {
      swal("Error", "Failed to delete the book.", "error");
    }
  };
  const handleEditBook = (book) => {
    setEditBookData(book);
    setEditBookModalOpen(true);
  };
  // Update book
  const submitEditBook = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    console.log("book details", editBookData);
    const title = BookNameValidation(editBookData.title);
    if (title) {
      validationErrors.title = title;
    }
    const author = NameValidation(editBookData.author);
    if (author) {
      validationErrors.author = author;
    }
    const price = PriceValidation(editBookData.price);
    if (price) {
      validationErrors.price = price;
    }
    const discount = DiscountValidation(editBookData.discountPercentage);
    if (discount) {
      validationErrors.discountPercentage = discount;
    }
    const description = DescriptionValidation(editBookData.description);
    if (description) {
      validationErrors.description = description;
    }
    if (editBookData.coverImage instanceof File) {
      const coverError = CoverImageValidation(editBookData.coverImage);
      if (coverError) {
        validationErrors.coverImage = coverError;
      }
    }
    if (editBookData.bookFile instanceof File) {
      const bookFileError = BookFileValidation(editBookData.bookFile);
      if (bookFileError) {
        validationErrors.bookFile = bookFileError;
      }
    }

    setErrors(validationErrors);
    console.log("validation errors", validationErrors);
    console.log("edit book data", editBookData);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await axios.put(
        `http://localhost:5001/api/book/update/${editBookData._id}`,
        editBookData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success("Book updated successfully");
      setEditBookModalOpen(false);
      fetchBooks();
    } catch (err) {
      toast.error("Failed to update book");
    }
  };
  // Show add book form
  if (showAddBook) {
    return (
      <AddBookMultiStep
        sellerId={sellerId}
        categories={categories}
        onCancel={() => setShowAddBook(false)}
        onSuccess={() => {
          setShowAddBook(false);
          fetchBooks();
        }}
      />
    );
  }

  return (
    <div className="p-4">
      {/* Controls */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">My Books</h2>

        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-black"
            onClick={() => setShowAddBook(true)}
          >
            <FaPlus className="mr-1" /> Add Book
          </button>

          <button
            className="btn btn-sm btn-black"
            onClick={() =>
              window.open(
                `http://localhost:5001/api/seller/${sellerId}/books/export`,
                "_blank",
              )
            }
          >
            <LuCloudDownload className="mr-1" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Downloads</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center">
                Loading...
              </td>
            </tr>
          ) : books.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No books found
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr
                key={book._id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setViewBook(book)}
              >
                <td>
                  <img
                    src={
                      book.coverImage
                        ? `http://localhost:5001/${book.coverImage.replaceAll(
                            "\\",
                            "/",
                          )}`
                        : "/placeholder-book.png"
                    }
                    className="w-12 h-20 object-cover rounded"
                  />
                </td>
                <td className="w-30">
                  {book.title.length > 15
                    ? book.title.substring(0, 15) + "..."
                    : book.title}
                </td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.soldCount ?? 0}</td>
                <td>{formatPrice(book.finalPrice || book.price)}</td>
                <td className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-sm btn-black"
                    onClick={() => handleEditBook(book)}
                  >
                    <MdOutlineEdit /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-black"
                    onClick={() => handleDelete(book._id)}
                  >
                    <RiDeleteBinLine /> Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* View Details Modal */}
      {viewBook && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Book Details</h3>
            <div className="space-y-4 grid grid-cols-2">
              <img
                src={
                  viewBook.coverImage
                    ? `http://localhost:5001/${viewBook.coverImage.replaceAll(
                        "\\",
                        "/",
                      )}`
                    : "/placeholder-book.png"
                }
                className="w-40  object-fill rounded"
              />
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Title:</span> {viewBook.title}
                </p>
                <p>
                  <span className="font-medium">Author:</span> {viewBook.author}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {viewBook.category}
                </p>
                <p>
                  <span className="font-medium">Price:</span>{" "}
                  {formatPrice(viewBook.finalPrice || viewBook.price)}
                </p>
                <p>
                  <span className="font-medium">Downloads:</span>{" "}
                  {viewBook.soldCount ?? 0}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {viewBook.description}
                </p>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setViewBook(null)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setViewBook(null)} />
          </form>
        </dialog>
      )}

      {/* Edit Modal */}

      <input
        type="checkbox"
        checked={editBookModalOpen}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative max-w-5xl max-h-[90vh] overflow-y-auto">
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setEditBookModalOpen(false)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Edit Book</h3>
          <form className="flex flex-col gap-2" onSubmit={submitEditBook}>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="font-semibold">Current Cover:</label>
                <img
                  src={`http://localhost:5001/${editBookData.coverImage}`}
                  className="w-full h-full mb-4 object-contain "
                  alt={editBookData.title}
                />
              </div>
              <div className="grid col-span-4 ">
                <div className="flex flex-col gap-2 ">
                  <label className="font-semibold">Change Cover:</label>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    className="file-input file-input-bordered"
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        coverImage: e.target.files[0],
                      })
                    }
                  />
                  {errors.coverImage && (
                    <p className="text-red-500 text-sm">{errors.coverImage}</p>
                  )}
                  <label className="font-semibold">Change Book File:</label>
                  <input
                    type="file"
                    name="bookFile"
                    accept=".pdf,.epub,.mobi"
                    className="file-input file-input-bordered"
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        bookFile: e.target.files[0],
                      })
                    }
                  />
                  {errors.bookFile && (
                    <p className="text-red-500 text-sm">{errors.bookFile}</p>
                  )}
                  <label className="font-semibold">Title:</label>
                  <input
                    type="text"
                    value={editBookData.title || " No title Found"}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        title: e.target.value,
                      })
                    }
                    className="input input-bordered"
                    placeholder="Title"
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                  <label className="font-semibold">Author:</label>
                  <input
                    type="text"
                    value={editBookData.author || " No Author Found"}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        author: e.target.value,
                      })
                    }
                    className="input input-bordered"
                    placeholder="Author"
                    required
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm">{errors.author}</p>
                  )}
                  <label className="font-semibold">Price:</label>
                  <input
                    type="number"
                    value={editBookData.price || "No price Found"}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        price: e.target.value,
                      })
                    }
                    className="input input-bordered"
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    required
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                  )}
                  <label className="font-semibold">Discount %:</label>
                  <input
                    type="number"
                    value={
                      editBookData.discountPercentage || "No discount Found"
                    }
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        discountPercentage: e.target.value,
                      })
                    }
                    className="input input-bordered"
                    placeholder="Discount %"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  {errors.discountPercentage && (
                    <p className="text-red-500 text-sm">
                      {errors.discountPercentage}
                    </p>
                  )}
                  <select
                    name="categoryID"
                    className="select select-bordered"
                    value={editBookData.category}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        category:
                          categories.find((c) => c._id === e.target.value)
                            ?.name || "",
                      })
                    }
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label className="font-semibold">Description:</label>
                  <textarea
                    value={editBookData.description || "No description Found"}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        description: e.target.value,
                      })
                    }
                    className="textarea textarea-bordered"
                    placeholder="Description"
                    required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-outline mt-2">
              Update Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerBookTable;
