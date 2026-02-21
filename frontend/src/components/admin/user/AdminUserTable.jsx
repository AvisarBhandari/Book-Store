import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import {
  getAdminUsersTable,
  adminDeleteUser,
  adminCreateUser,
  adminUpdateUser,
} from "../../../api/AdminDashboard.api.js";
import {
  NameValidation,
  EmailValidation,
  PasswordValidation,
} from "../../../utils/validation.js";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchUsers = async (pageNumber = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const res = await getAdminUsersTable({
        page: pageNumber,
        search: searchTerm,
      });
      setUsers(res.data || []);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Failed to load users table:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;
    try {
      await adminDeleteUser(id);
      // Optimistically update list
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // Refresh current page from server in background
      fetchUsers(page, search);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user.");
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "" });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name || "", email: user.email || "", password: "" });
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
   const nameError = NameValidation(form.name);
    if (nameError) {
      validationErrors.name = nameError;
    }

    const emailError = EmailValidation(form.email);
    if (emailError) validationErrors.email = emailError;
    if (!editingUser) {
      const passwordError = PasswordValidation(form.password);
      if (passwordError) validationErrors.password = passwordError;
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
      
    try {
      if (editingUser) {
        await adminUpdateUser(editingUser.id, {
          name: form.name,
          email: form.email,
        });
      } else {
        await adminCreateUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      }
      setModalOpen(false);
      // Refresh from first page to show newest entries
      setPage(1);
      fetchUsers(1, search);
    } catch (err) {
      console.error("Failed to save user:", err);
      alert("Failed to save user.");
    }
  };

  const handleExportCsv = () => {
    if (!users.length) return;

    const headers = ["Name", "Email", "Books", "Total Spent"];
    const rows = users.map((u) => [
      u.name ?? "",
      u.email ?? "",
      (u.bookTitles || []).join(" | "),
      u.totalSpent ?? 0,
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
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-base-100 rounded-xl shadow p-4 space-y-4">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="font-semibold text-lg">Customer List</h3>

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
                <th>Books Purchased</th>
                <th>Total Spent</th>
                <th className="w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td
                    className="max-w-xs truncate"
                    title={(u.bookTitles || []).join(", ")}
                  >
                    {u.bookTitles && u.bookTitles.length
                      ? u.bookTitles.join(", ")
                      : "—"}
                  </td>
                  <td>{new Intl.NumberFormat().format(u.totalSpent ?? 0)}</td>
                  <td>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => openEditModal(u)}
                      >
                        <MdOutlineEdit />
                      </button>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => handleDelete(u.id)}
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan={5} className="text-center text-sm py-4">
                    No users found.
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
              {editingUser ? "Edit User" : "Add User"}
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
                  <p className="text-red-500 text-sm">{errors.name}</p>
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
                  <span className="text-sm text-error mt-1">{errors.email}</span>
                )}
              </div>
              {!editingUser && (
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
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminUserTable;
