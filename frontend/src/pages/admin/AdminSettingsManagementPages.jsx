import React, { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAdminAdminsTable,
  adminCreateAdmin,
  adminDeleteAdmin,
  exportAdminsCSV,
} from "../../api/AdminDashboard.api.js";
import {
  NameValidation,
  EmailValidation,
  DisplayNameValidation,
  DateOfBirthValidation,
  AvatarImageValidation,
} from "../../utils/validation.js";

const TABS = [
  { id: "profile", label: "Edit Profile" },
  { id: "security", label: "Security" },
  { id: "admins", label: "Add Admin" },
];

// ------------------------- Edit Profile Tab -------------------------
const EditProfileTab = ({ admin, onUpdate }) => {
  const [form, setForm] = useState({
    name: "",
    userName: "",
    dateOfBirth: "",
    email: "",
    avatarFile: null,
  });
  const [errors, setErrors] = useState({});

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (admin) {
      setForm({
        name: admin.name || "",
        userName: admin.userName || "",
        dateOfBirth: admin.dateOfBirth
          ? new Date(admin.dateOfBirth).toISOString().slice(0, 10)
          : "",
        email: admin.email || "",
      });
      setAvatarPreview(
        admin.ppImage ? `http://localhost:5001/${admin.ppImage}` : null,
      );
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    const nameError = NameValidation(form.name);
    if (nameError) validationErrors.name = nameError;
    const userNameError = DisplayNameValidation(form.userName);
    if (userNameError) validationErrors.userName = userNameError;
    const dobError = DateOfBirthValidation(form.dateOfBirth);
    if (dobError) validationErrors.dateOfBirth = dobError;
    const emailError = EmailValidation(form.email);
    if (emailError) validationErrors.email = emailError;
    const avatarError = AvatarImageValidation(avatarFile);
    if (avatarError) validationErrors.avatarFile = avatarError;
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setSaving(false);
      return;
    }
    setMessage({ type: "", text: "" });
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("userName", form.userName);
      if (form.dateOfBirth) formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("email", form.email);
      if (avatarFile) formData.append("ppadmin", avatarFile);

      await updateAdminProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully." });
      onUpdate?.();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-base-300 bg-base-200">
              <img
                src={avatarPreview || "https://via.placeholder.com/112"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-content shadow group-hover:bg-primary-focus">
              <CiEdit size={20} />
            </div>
          </div>
          <span className="text-xs text-base-content/60">Change photo</span>
          {errors.avatarFile && (
            <div className="text-xs text-error mt-1">{errors.avatarFile}</div>
          )}
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control sm:col-span-2">
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <div className="text-xs text-error mt-1">{errors.name}</div>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">User Name</span>
            </label>
            <input
              type="text"
              name="userName"
              className="input input-bordered w-full"
              value={form.userName}
              onChange={handleChange}
            />
            {errors.userName && (
              <p className="text-xs text-error mt-1">{errors.userName}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date of Birth</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="input input-bordered w-full"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <div className="text-xs text-error mt-1">
                {errors.dateOfBirth}
              </div>
            )}
          </div>
          <div className="form-control sm:col-span-2">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <div className="text-xs text-error mt-1">{errors.email}</div>
            )}
          </div>
          {message.text && (
            <div
              className={`alert sm:col-span-2 ${
                message.type === "success" ? "alert-success" : "alert-error"
              }`}
            >
              <span>{message.text}</span>
            </div>
          )}
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="btn btn-neutral text-white"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// ------------------------- Security Tab -------------------------
const SecurityTab = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (form.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await changeAdminPassword(form.currentPassword, form.newPassword);
      setMessage({ type: "success", text: "Password updated successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current Password</span>
          </label>
          <input
            type="password"
            name="currentPassword"
            className="input input-bordered w-full"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            className="input input-bordered w-full"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="input input-bordered w-full"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {message.text && (
          <div
            className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
          >
            <span>{message.text}</span>
          </div>
        )}
        <button
          type="submit"
          className="btn btn-neutral text-white"
          disabled={saving}
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
};

// ------------------------- Add Admin Tab -------------------------
const AddAdminTab = ({ currentAdminId }) => {
  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchAdmins = async (
    pageNum = 1,
    searchTerm = "",
    order = sortOrder,
  ) => {
    try {
      setLoading(true);
      const res = await getAdminAdminsTable({
        page: pageNum,
        search: searchTerm,
        sortOrder: order,
      });
      setAdmins(res.data || []);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Failed to load admins:", err);
      setError("Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(page, search, sortOrder);
  }, [page, search, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const toggleSort = () => {
    const next = sortOrder === "asc" ? "dsc" : "asc";
    setSortOrder(next);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportAdminsCSV(search, sortOrder);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "admins.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentAdminId) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm("Delete this admin?")) return;
    try {
      await adminDeleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      fetchAdmins(page, search, sortOrder);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete admin.");
    }
  };

  const openAddModal = () => {
    setForm({ name: "", email: "", password: "" });
    setAvatarFile(null);
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (avatarFile) formData.append("ppadmin", avatarFile);
      await adminCreateAdmin(formData);
      setModalOpen(false);
      setPage(1);
      fetchAdmins(1, search, sortOrder);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add admin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <button className="btn btn-primary btn-sm gap-1" onClick={openAddModal}>
          Add Admin
        </button>
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 min-w-[200px] max-w-xs"
        >
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered input-sm w-full pl-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-outline"
            onClick={toggleSort}
            title="Sort by name"
          >
            Name {sortOrder === "asc" ? "ASC" : "DSC"}
          </button>
          <button
            className="btn btn-sm btn-outline gap-1"
            onClick={handleExport}
            disabled={exporting}
          >
            <LuDownload size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-base-100">
        {loading ? (
          <div className="p-6 space-y-2">
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 alert alert-error">{error}</div>
        ) : (
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>User Name</th>
                <th>Email</th>
                <th className="w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="w-8 rounded-full bg-neutral text-neutral-content">
                        {a.ppImage ? (
                          <img
                            src={`http://localhost:5001/${a.ppImage}`}
                            alt=""
                          />
                        ) : (
                          <span className="text-xs">
                            {(a.name || "A").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    {a.name}
                  </td>
                  <td>{a.userName || "—"}</td>
                  <td>{a.email}</td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        className="btn btn-xs btn-ghost text-error"
                        onClick={() => handleDelete(a.id)}
                        disabled={a.id === currentAdminId}
                        title={
                          a.id === currentAdminId
                            ? "Cannot delete yourself"
                            : "Delete admin"
                        }
                      >
                        <MdDeleteOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!admins.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-base-content/70"
                  >
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              «
            </button>
            <span className="join-item btn btn-sm btn-disabled">
              Page {page} of {totalPages}
            </span>
            <button
              className="join-item btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {modalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add Admin</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
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
              </div>
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
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Avatar (optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-sm"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                >
                  {submitting ? "Adding…" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setModalOpen(false)}>
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

// ------------------------- Main Settings Page -------------------------
const AdminSettingsManagementPages = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await getAdminProfile();
      if (res?.user) setAdmin(res.user);
    } catch (err) {
      console.error("Failed to load admin profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-12 w-full max-w-2xl" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-base-content/70">
          Manage your profile, security, and admins.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200/50 p-1 rounded-lg w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profile" && (
        <EditProfileTab admin={admin} onUpdate={loadProfile} />
      )}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "admins" && (
        <AddAdminTab currentAdminId={admin?._id || admin?.id} />
      )}
    </div>
  );
};

export default AdminSettingsManagementPages;
