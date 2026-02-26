import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import BookTable from "./BookTable";
import CategoryTable from "./CategoryTable";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // For editing
  const [editBookData, setEditBookData] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState(null);

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        await axios.get("http://localhost:5001/api/admin/profile", {
          withCredentials: true,
        });
      } catch {
        toast.error("Cannot fetch admin info. Login as admin first.");
      } finally {
        setLoadingAdmin(false);
      }
    };
    fetchAdmin();
  }, []);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/search/filter");
      setBooks(res.data.books || []);
    } catch {
      toast.error("Failed to fetch books");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categorie");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Sorting
  const sortBooks = (col) => {
    const sorted = [...books].sort((a, b) =>
      a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0,
    );
    setBooks(sorted);
  };

  const sortCategories = (col) => {
    const sorted = [...categories].sort((a, b) =>
      a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0,
    );
    setCategories(sorted);
  };

  // Delete without confirmation
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/book/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Book deleted");
      fetchBooks();
    } catch {
      toast.error("Failed to delete book");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/categorie/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // Edit functions
  const handleEditBook = (book) => setEditBookData(book);
  const handleEditCategory = (cat) => setEditCategoryData(cat);

  if (loadingAdmin)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6 text-black">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-4">Book & Category Management</h2>

      <BookTable
        books={books}
        sortBooks={sortBooks}
        handleEditBook={handleEditBook}
        onDelete={deleteBook} // delete immediately
      />

      <CategoryTable
        categories={categories}
        sortCategories={sortCategories}
        handleEditCategory={handleEditCategory}
        onDelete={deleteCategory} // delete immediately
      />

      {/* Simple Edit Modal for Book */}
      {editBookData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Book</h3>
            <p>Title: {editBookData.title}</p>
            <p>Author: {editBookData.author}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-outline"
                onClick={() => setEditBookData(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Edit Modal for Category */}
      {editCategoryData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Category</h3>
            <p>Name: {editCategoryData.name}</p>
            <p>Description: {editCategoryData.description}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-outline"
                onClick={() => setEditCategoryData(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
