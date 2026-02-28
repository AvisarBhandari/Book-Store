import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoAddOutline } from "react-icons/io5";
import { GoTag } from "react-icons/go";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import swal from "sweetalert";
import {
  NameValidation,
  PriceValidation,
  DiscountValidation,
  BookNameValidation,
  DescriptionValidation,
  CategoryDescriptionValidation,
  CategoryNameValidation,
  GenresValidation,
  BookFileValidation,
  CoverImageValidation,
} from "../../utils/validation";

const BookManagement = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  const [adminId, setAdminId] = useState("");
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // Modals
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editBookModalOpen, setEditBookModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);

  // Form states
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
  const [categoryData, setCategoryData] = useState({});
  const [editBookData, setEditBookData] = useState({
    title: "",
    description: "",
    price: "",
    coverImage: null,
    bookFile: null,
    author: "",
    discountPercentage: "",
  });
  const [editCategoryData, setEditCategoryData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Data lists
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Sorting
  const [bookSort, setBookSort] = useState({ column: null, asc: true });
  const [categorySort, setCategorySort] = useState({ column: null, asc: true });

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/admin/profile", {
          withCredentials: true,
        });
        if (res.data?.user?._id) setAdminId(res.data.user._id);
      } catch (err) {
        toast.error("Cannot fetch admin info. Login as admin first.");
      } finally {
        setLoadingAdmin(false);
      }
    };
    fetchAdmin();
  }, []);

  // Fetch books
  const fetchBooks = async (pageNumber = 1) => {
    try {
      const res = await axios.get("http://localhost:5001/api/search/filter", {
        params: {
          page: pageNumber,
          limit: LIMIT,
        },
      });

      if (res.data?.books) {
        setBooks(res.data.books);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      toast.error("Failed to fetch books");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categorie");
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);
  useEffect(() => {
    fetchCategories();
  }, []);

  // Sorting helpers
  const sortBooks = (column) => {
    const asc = bookSort.column === column ? !bookSort.asc : true;
    setBookSort({ column, asc });
    const sorted = [...books].sort((a, b) => {
      if (a[column] < b[column]) return asc ? -1 : 1;
      if (a[column] > b[column]) return asc ? 1 : -1;
      return 0;
    });
    setBooks(sorted);
  };

  const sortCategories = (column) => {
    const asc = categorySort.column === column ? !categorySort.asc : true;
    setCategorySort({ column, asc });
    const sorted = [...categories].sort((a, b) => {
      if (a[column] < b[column]) return asc ? -1 : 1;
      if (a[column] > b[column]) return asc ? 1 : -1;
      return 0;
    });
    setCategories(sorted);
  };

  // Delete handlers
  const handleDeleteBook = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, this book cannot be recovered!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!willDelete) return; // Stop if user cancels

    try {
      await axios.delete(`http://localhost:5001/api/book/delete/${id}`, {
        withCredentials: true,
      });

      toast.success("Book deleted successfully");
      fetchBooks(page);
    } catch (err) {
      toast.error("Failed to delete book");
    }
  };

  const handleDeleteCategory = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, this category cannot be recovered!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      await axios.delete(`http://localhost:5001/api/categorie/delete/${id}`, {
        withCredentials: true,
      });

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  // Edit handlers
  const handleEditBook = (book) => {
    setEditBookData(book);
    setEditBookModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setEditCategoryData(cat);
    setEditCategoryModalOpen(true);
  };

  const submitEditBook = async (e) => {
    e.preventDefault();
    const validationErrors = {};

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

    setErrors(validationErrors);

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
  const submitEditCategory = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    const name = CategoryNameValidation(editCategoryData.name);
    if (name) {
      validationErrors.name = name;
    }
    const description = CategoryDescriptionValidation(
      editCategoryData.description,
    );
    if (description) {
      validationErrors.description = description;
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      await axios.put(
        `http://localhost:5001/api/categorie/update/${editCategoryData._id}`,
        editCategoryData,
        {
          withCredentials: true,
        },
      );
      toast.success("Category updated");
      setEditCategoryModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };
  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const submitNewBook = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const title = formData.get("title");
    const author = formData.get("author");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryID = formData.get("categoryID");
    const coverImage = formData.get("coverImage");
    const bookFile = formData.get("bookFile");

    const validationErrors = {};

    const titleError = BookNameValidation(title);
    if (titleError) validationErrors.title = titleError;
    const authorError = NameValidation(author);
    if (authorError) validationErrors.author = authorError;
    const descriptionError = DescriptionValidation(description);
    if (descriptionError) validationErrors.description = descriptionError;
    const priceError = PriceValidation(price);
    if (priceError) validationErrors.price = priceError;
    const genresError = GenresValidation(formData.get("genres"));
    if (genresError) validationErrors.genres = genresError;
    const descriptionCategoryError = CategoryDescriptionValidation(
      formData.get("description"),
    );
    if (descriptionCategoryError)
      validationErrors.description = descriptionCategoryError;
    const coverImageError = CoverImageValidation(coverImage);
    if (coverImageError) validationErrors.coverImage = coverImageError;
    const bookFileError = BookFileValidation(bookFile);
    if (bookFileError) validationErrors.bookFile = bookFileError;

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const cat = categories.find((c) => c._id === categoryID);
      if (cat) {
        formData.set("category", cat.name);
      }

      await axios.post("http://localhost:5001/api/book/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book created successfully");
      setBookModalOpen(false);
      e.target.reset();
      fetchBooks(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create book");
    }
  };
  const handleCategoryChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };
  const submitNewCategory = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    const name = CategoryNameValidation(categoryData.name);
    if (name) {
      validationErrors.name = name;
    }
    const description = CategoryDescriptionValidation(categoryData.description);
    if (description) {
      validationErrors.description = description;
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      const formData = new FormData(e.target);
      const payload = {
        name: formData.get("name"),
        description: formData.get("description"),
      };
      await axios.post("http://localhost:5001/api/categorie/create", payload);
      toast.success("Category created");
      setCategoryModalOpen(false);
      e.target.reset();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    }
  };

  if (loadingAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 text-black">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Book & Category Management</h2>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="btn btn-outline flex items-center gap-2"
          onClick={() => setBookModalOpen(true)}
        >
          <IoAddOutline size={20} /> Add Book
        </button>
        <button
          className="btn btn-outline flex items-center gap-2"
          onClick={() => setCategoryModalOpen(true)}
        >
          <GoTag size={20} /> Add Category
        </button>
      </div>

      {/* BOOK TABLE */}
      <div className="overflow-x-auto mb-8">
        <table className="table table-compact w-full border">
          <thead>
            <tr>
              <th>Cover</th>
              <th onClick={() => sortBooks("title")}>Title</th>
              <th onClick={() => sortBooks("author")}>Author</th>
              <th onClick={() => sortBooks("category")}>Category</th>
              <th onClick={() => sortBooks("soldCount")}>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td>
                  <img
                    src={`http://localhost:5001/${b.coverImage}`}
                    className="w-12 h-12 object-contain rounded"
                    alt={b.title}
                  />
                </td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>{b.soldCount}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEditBook(b)}
                    className="btn btn-sm btn-outline"
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(b._id)}
                    className="btn btn-sm btn-outline"
                  >
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      <div className="flex justify-center mt-4">
        <div className="join">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            «
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`join-item btn ${page === i + 1 ? "btn-active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </button>
        </div>
      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-x-auto mb-8">
        <table className="table table-compact w-full border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(c)}
                    className="btn btn-sm btn-outline"
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c._id)}
                    className="btn btn-sm btn-outline"
                  >
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD BOOK MODAL */}
      <input
        type="checkbox"
        checked={bookModalOpen}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative max-w-xl">
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setBookModalOpen(false)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Add Book</h3>
          <form
            className="flex flex-col gap-2"
            onSubmit={submitNewBook}
            encType="multipart/form-data"
          >
            <label htmlFor="title" className="font-semibold">
              Title:
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered"
              placeholder="Title"
              required
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
            <label htmlFor="author" className="font-semibold">
              Author:
            </label>
            <input
              type="text"
              name="author"
              className="input input-bordered"
              placeholder="Author"
              required
              onChange={handleChange}
            />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author}</p>
            )}
            <label htmlFor="description" className="font-semibold">
              Description:
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered"
              placeholder="Description"
              required
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <label htmlFor="price" className="font-semibold">
              Price:
            </label>
            <input
              type="number"
              name="price"
              className="input input-bordered"
              placeholder="Price"
              step="0.01"
              min="0"
              required
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
            <label htmlFor="discountPercentage" className="font-semibold">
              Discount % (optional):
            </label>
            <input
              type="number"
              name="discountPercentage"
              className="input input-bordered"
              placeholder="Discount % (optional)"
              step="0.01"
              min="0"
              max="100"
              onChange={handleChange}
            />
            {errors.discountPercentage && (
              <p className="text-red-500 text-sm">
                {errors.discountPercentage}
              </p>
            )}
            <label htmlFor="genres" className="font-semibold">
              Genres:
            </label>
            <input
              type="text"
              name="genres"
              className="input input-bordered"
              placeholder="Genres (comma separated)"
              onChange={handleChange}
            />
            {errors.genres && (
              <p className="text-red-500 text-sm">{errors.genres}</p>
            )}
            <label htmlFor="categoryID" className="font-semibold">
              Category:
            </label>
            <select
              name="categoryID"
              className="select select-bordered"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label htmlFor="cover" className="font-semibold">
              Cover Image:
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="file-input file-input-bordered"
              required
            />
            {errors.coverImage && (
              <p className="text-red-500 text-sm">{errors.coverImage}</p>
            )}
            <label htmlFor="bookFile" className="font-semibold">
              Book File:
            </label>
            <input
              type="file"
              name="bookFile"
              accept=".pdf,.epub,.mobi"
              className="file-input file-input-bordered"
              required
            />
            {errors.bookFile && (
              <p className="text-red-500 text-sm">{errors.bookFile}</p>
            )}
            <button type="submit" className="btn btn-outline mt-2">
              Create Book
            </button>
          </form>
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      <input
        type="checkbox"
        checked={categoryModalOpen}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative max-w-md">
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setCategoryModalOpen(false)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Add Category</h3>
          <form className="flex flex-col gap-2" onSubmit={submitNewCategory}>
            <label htmlFor="name" className="font-semibold">
              Name:
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered"
              placeholder="Category Name"
              required
              onChange={handleCategoryChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <label htmlFor="description" className="font-semibold">
              Description:
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered"
              placeholder="Description"
              onChange={handleCategoryChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <button type="submit" className="btn btn-outline mt-2">
              Create Category
            </button>
          </form>
        </div>
      </div>

      {/* EDIT BOOK MODAL */}
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
              <div className="grid col-span-4 overflow-auto">
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
                  <label className="font-semibold">Title:</label>
                  <input
                    type="text"
                    value={editBookData.title || ""}
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
                    value={editBookData.author || ""}
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
                    value={editBookData.price || ""}
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
                    value={editBookData.discountPercentage || ""}
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
                    Value={editBookData.category}
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
                    value={editBookData.description || ""}
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

      {/* EDIT CATEGORY MODAL */}
      <input
        type="checkbox"
        checked={editCategoryModalOpen}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative max-w-md">
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setEditCategoryModalOpen(false)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Edit Category</h3>
          <form className="flex flex-col gap-2" onSubmit={submitEditCategory}>
            <input
              type="text"
              value={editCategoryData.name || ""}
              onChange={(e) =>
                setEditCategoryData({
                  ...editCategoryData,
                  name: e.target.value,
                })
              }
              className="input input-bordered"
              placeholder="Category Name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <textarea
              value={editCategoryData.description || ""}
              onChange={(e) =>
                setEditCategoryData({
                  ...editCategoryData,
                  description: e.target.value,
                })
              }
              className="textarea textarea-bordered"
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <button type="submit" className="btn btn-outline mt-2">
              Update Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;
