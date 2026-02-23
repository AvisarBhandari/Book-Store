import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AddEditBookDrawer = ({
  open,
  onClose,
  sellerId,
  mode = "add",
  initialData = null,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [previewCover, setPreviewCover] = useState(null);

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

  // ================= PREFILL (EDIT MODE) =================
  useEffect(() => {
    if (mode === "edit" && initialData) {
      console.log("✏️ PREFILL EDIT DATA:", initialData);

      setFormData({
        title: initialData.title || "",
        author: initialData.author || "",
        description: initialData.description || "",
        categoryID: initialData.categoryID || "",
        category: initialData.category || "",
        coverImage: null,
        bookFile: null,
        price: initialData.price || "",
        discountPercentage: initialData.discountPercentage || 0,
      });

      if (initialData.coverImage) {
        setPreviewCover(
          `http://localhost:5001/${initialData.coverImage.replaceAll(
            "\\",
            "/",
          )}`,
        );
      }
    }
  }, [mode, initialData]);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ CATEGORY ERROR:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });

      if (name === "coverImage") {
        setPreviewCover(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    console.log("📦 SUBMIT MODE:", mode, formData);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) data.append(k, v);
    });

    data.append("seller", sellerId);

    try {
      let res;

      if (mode === "edit") {
        res = await axios.put(
          `http://localhost:5001/api/book/update/${initialData._id}`,
          data,
          { withCredentials: true },
        );
      } else {
        res = await axios.post("http://localhost:5001/api/book/create", data, {
          withCredentials: true,
        });
      }

      console.log("✅ SUBMIT SUCCESS:", res.data);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl h-full bg-white p-6 overflow-y-auto"
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {mode === "edit" ? "Edit Book" : "Add New Book"}
            </h2>

            {/* STEP CONTENT */}
            {step === 1 && (
              <div className="space-y-3">
                <input
                  className="input input-bordered w-full"
                  placeholder="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
                <select
                  className="select select-bordered w-full"
                  name="categoryID"
                  value={formData.categoryID}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleChange}
                />
                {previewCover && (
                  <img
                    src={previewCover}
                    className="w-32 h-40 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  name="bookFile"
                  accept="application/pdf"
                  onChange={handleChange}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Discount %"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* NAV */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  className="btn btn-outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  className="btn btn-primary ml-auto"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn btn-success ml-auto"
                  onClick={handleSubmit}
                >
                  {mode === "edit" ? "Save Changes" : "Add Book"}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEditBookDrawer;
