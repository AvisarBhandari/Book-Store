import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  NameValidation,
  PriceValidation,
  DiscountValidation,
  BookNameValidation,
  DescriptionValidation,
  BookFileValidation,
  CoverImageValidation,
} from "../../utils/validation";

const AddBookMultiStep = ({ sellerId, onCancel, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    categoryID: "",
    category: "",
    coverImage: null,
    bookFile: null,
    price: "",
    discountPercentage: "",
  });
  const [previewCover, setPreviewCover] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const variants = {
    initial: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/categorie");
        setCategories(res.data || []);
      } catch (err) {
        console.error(" CATEGORY FETCH ERROR:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      if (name === "coverImage") setPreviewCover(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Step navigation
  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      console.log("Validating Step 1:", formData);
      const titleError = BookNameValidation(formData.title);
      const authorError = NameValidation(formData.author);

      if (titleError) newErrors.title = titleError;
      if (authorError) newErrors.author = authorError;
      if (!formData.categoryID)
        newErrors.categoryID = "Please select a category.";
    }

    if (step === 2) {
      const coverError = CoverImageValidation(formData.coverImage);
      const fileError = BookFileValidation(formData.bookFile);
      const descError = DescriptionValidation(formData.description);

      if (coverError) newErrors.coverImage = coverError;
      if (fileError) newErrors.bookFile = fileError;
      if (descError) newErrors.description = descError;
    }

    if (step === 3) {
      const priceError = PriceValidation(formData.price);
      const discountError = DiscountValidation(formData.discountPercentage);

      if (priceError) newErrors.price = priceError;
      if (discountError) newErrors.discountPercentage = discountError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (!validateStep()) return;

    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // Submit book
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("description", formData.description);
      data.append("categoryID", formData.categoryID);
      const selectedCategory = categories.find(
        (c) => c._id === formData.categoryID,
      );
      data.append("category", selectedCategory?.name || "");
      data.append("coverImage", formData.coverImage);
      data.append("bookFile", formData.bookFile);
      data.append("price", formData.price);
      data.append("discountPercentage", formData.discountPercentage || 0);
      data.append("seller", sellerId);

      const res = await axios.post(
        "http://localhost:5001/api/book/create",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        alert("Book added successfully!");
        onSuccess?.();
      }
    } catch (err) {
      console.error(" BOOK CREATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  p-6 h-full bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>

      {/* Stepper */}
      <div className="steps steps-horizontal w-full relative z-10">
        {" "}
        {["Info", "Files", "Price", "Confirm"].map((label, index) => (
          <div
            key={index}
            className={`step transition-all duration-300 ${
              step >= index + 1 ? "step-primary scale-sl" : ""
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden h-[410px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute w-full"
          >
            {/* Step 1: Title, Author, Category */}
            {step === 1 && (
              <div className="space-y-4 overflow-auto h-full">
                <div>
                  <label className="label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="label">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                  )}
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    name="categoryID"
                    value={formData.categoryID}
                    onChange={handleChange}
                    className={`select select-bordered w-full ${errors.categoryID ? "border-red-500" : ""}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryID && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categoryID}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: File Upload */}
            {step === 2 && (
              <div className="space-y-4 overflow-auto h-full">
                <div className="grid grid-cols-2">
                  <div>
                    <label className="label">Cover Image</label>
                    <input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="input w-full"
                    />
                    {previewCover && (
                      <img
                        src={previewCover}
                        alt="Cover Preview"
                        className="w-20 h-30 mt-1 pl-5 object-scale-down rounded"
                      />
                    )}
                  </div>
                  <div>
                    <label className="label">Book File</label>
                    <input
                      type="file"
                      name="bookFile"
                      accept="application/pdf"
                      onChange={handleChange}
                      className="input w-full"
                    />
                    {errors.bookFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bookFile}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`textarea textarea-bordered w-full ${errors.description ? "border-red-500" : ""}`}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Price & Discount */}
            {step === 3 && (
              <div className="space-y-4 overflow-auto h-full">
                <div>
                  <label className="label">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${errors.price ? "border-red-500" : ""}`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="label">Discount (%)</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-2 pt-5">
                  Confirm Details
                </h3>
                <div className="grid grid-cols-5">
                  <div className="grid col-span-3">
                    <div>
                      <strong>Title:</strong> {formData.title}
                    </div>
                    <div>
                      <strong>Author:</strong> {formData.author}
                    </div>
                    <div>
                      <strong>Category:</strong>{" "}
                      {
                        categories.find((c) => c._id === formData.categoryID)
                          ?.name
                      }
                    </div>
                    <div>
                      <strong>Description:</strong> {formData.description}
                    </div>
                    <div>
                      <strong>Price:</strong> Rs. {formData.price}
                    </div>
                    <div>
                      <strong>Discount:</strong>{" "}
                      {formData.discountPercentage || 0}%
                    </div>
                  </div>
                  <div className="col-span-2">
                    {previewCover && (
                      <div>
                        <strong>Cover Preview:</strong>
                        <img
                          src={previewCover}
                          alt="Cover"
                          className="w-42 h-60 mt-2 object-scale-down rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-1">
        <button
          className="btn btn-outline"
          onClick={step === 1 ? onCancel : handleBack}
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 4 && (
          <button className="btn btn-primary ml-auto" onClick={handleNext}>
            Next
          </button>
        )}

        {step === 4 && (
          <button
            className={`btn btn-success ml-auto ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            Confirm & Add Book
          </button>
        )}
      </div>
    </div>
  );
};

export default AddBookMultiStep;
