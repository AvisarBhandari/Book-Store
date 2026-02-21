import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import {
  getAdminSellersTable,
  adminDeleteSeller,
  adminCreateSeller,
  adminUpdateSeller,
} from "../../../api/AdminDashboard.api.js";
import {
  NameValidation,
  EmailValidation,
  PasswordValidation,
  PhoneValidation,
  StoreNameValidation,
} from "../../../utils/validation.js";

const AdminSellerTable = () => {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    storeName: "",
    businessType: "self-publish",
  });

  const fetchSellers = async (pageNumber = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const res = await getAdminSellersTable({
        page: pageNumber,
        search: searchTerm,
      });
      setSellers(res.data || []);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Failed to load sellers table:", err);
      setError("Failed to load sellers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this seller?");
    if (!confirmed) return;
    try {
      await adminDeleteSeller(id);
      // Optimistically update list
      setSellers((prev) => prev.filter((s) => s.id !== id));
      // Refresh current page from server in background
      fetchSellers(page, search);
    } catch (err) {
      console.error("Failed to delete seller:", err);
      alert("Failed to delete seller.");
    }
  };

  const openAddModal = () => {
    setEditingSeller(null);
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      storeName: "",
      businessType: "self-publish",
    });
    setModalOpen(true);
  };

  const openEditModal = (seller) => {
    setEditingSeller(seller);
    setForm({
      name: seller.name || "",
      email: seller.email || "",
      password: "",
      phone: seller.phone || "",
      storeName: seller.storeName || "",
      businessType: seller.businessType || "self-publish",
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    const nameValidation = NameValidation(form.name);
    if (nameValidation) {
      validationErrors.name = nameValidation;
    }
    const emailValidation = EmailValidation(form.email);
    if (emailValidation) {
      validationErrors.email = emailValidation;
    }
    const phoneValidation = PhoneValidation(form.phone);
    if (phoneValidation) {
      validationErrors.phone = phoneValidation;
    }
    const storeNameValidation = StoreNameValidation(
      form.storeName,
      form.businessType,
    );
    if (storeNameValidation) {
      validationErrors.storeName = storeNameValidation;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    validationErrors.email = EmailValidation(form.email);

    try {
      if (editingSeller) {
        await adminUpdateSeller(editingSeller.id, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          storeName: form.storeName,
          businessType: form.businessType,
        });
      } else {
        await adminCreateSeller({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          storeName: form.storeName,
          businessType: form.businessType,
        });
      }
      setModalOpen(false);
      setPage(1);
      fetchSellers(1, search);
    } catch (err) {
      console.error("Failed to save seller:", err);
      alert("Failed to save seller.");
    }
  };

  const handleExportCsv = () => {
    if (!sellers.length) return;

    const headers = ["Name", "Email", "Phone", "Store Name", "Business Type"];
    const rows = sellers.map((s) => [
      s.name ?? "",
      s.email ?? "",
      s.phone ?? "",
      s.storeName ?? "",
      s.businessType ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (field) =>
              `"${String(field).replace(/"/g, '""').replace(/\n/g, " ")}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sellers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-base-100 rounded-xl shadow p-4 space-y-4">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="font-semibold text-lg">Seller List</h3>

        <div className="flex flex-1 md:flex-none items-center gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 md:w-64"
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered input-sm w-full pl-8"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <button
            className="btn btn-sm btn-outline gap-1"
            onClick={openAddModal}
          >
            <IoAddOutline size={16} />
            Add
          </button>
        </div>

        <button
          className="btn btn-sm btn-outline gap-1 ml-auto md:ml-0"
          onClick={handleExportCsv}
        >
          <LuDownload size={16} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-full" />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <table className="table table-compact w-full border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Store Name</th>
                <th>Business Type</th>
                <th className="w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone || "—"}</td>
                  <td>{s.storeName || "—"}</td>
                  <td className="capitalize">
                    {s.businessType ? s.businessType.replace("-", " ") : "—"}
                  </td>
                  <td>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => openEditModal(s)}
                      >
                        <MdOutlineEdit />
                      </button>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => handleDelete(s.id)}
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!sellers.length && (
                <tr>
                  <td colSpan={6} className="text-center text-sm py-4">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-end">
          <div className="join">
            <button
              className="join-item btn btn-xs"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              «
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`join-item btn btn-xs ${
                  page === i + 1 ? "btn-active" : ""
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="join-item btn btn-xs"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingSeller ? "Edit Seller" : "Add Seller"}
            </h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered input-sm"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
                {errors.name && (
                  <span className="text-sm text-error mt-1">{errors.name}</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered input-sm"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
                {errors.email && (
                  <span className="text-sm text-error mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
              {!editingSeller && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="input input-bordered input-sm"
                    value={form.password}
                    onChange={handleFormChange}
                    required
                  />
                  {errors.password && (
                    <span className="text-sm text-error mt-1">
                      {errors.password}
                    </span>
                  )}
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone No</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  className="input input-bordered input-sm"
                  value={form.phone}
                  onChange={handleFormChange}
                />
                {errors.phone && (
                  <span className="text-sm text-error mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Store Name</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  className="input input-bordered input-sm"
                  value={form.storeName}
                  onChange={handleFormChange}
                />
                {errors.storeName && (
                  <span className="text-sm text-error mt-1">
                    {errors.storeName}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Business Type</span>
                </label>
                <select
                  name="businessType"
                  className="select select-bordered select-sm"
                  value={form.businessType}
                  onChange={handleFormChange}
                  required
                >
                  <option value="self-publish">Self publish</option>
                  <option value="publisher">Publisher</option>
                </select>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  {editingSeller ? "Save Changes" : "Create Seller"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminSellerTable;
