import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CiEdit } from "react-icons/ci";

const API = "http://localhost:5001/api/user";

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      setProfileForm({ name: user.name || "", email: user.email || "" });
      setAvatarPreview(
        user.ppImage ? `http://localhost:5001/${user.ppImage}` : null
      );
    }
  }, [user, authLoading, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      if (avatarFile) formData.append("ppuser", avatarFile);
      await axios.put(`${API}/profile`, formData, {
        withCredentials: true,
        headers: {},
      });
      toast.success("Profile updated");
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${API}/profile/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      );
      toast.success("Password updated");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  if (!user) return null;

  const tabs = [
    { id: "profile", label: "Edit Profile" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow px-4 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="tabs tabs-boxed bg-base-200/50 p-1 rounded-lg w-fit mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? "tab-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
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
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setAvatarFile(f);
                      setAvatarPreview(URL.createObjectURL(f));
                    }
                  }}
                />
                <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-content">
                  <CiEdit size={20} />
                </div>
              </div>
              <span className="text-xs text-base-content/60">Change photo</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Name</span></label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" className="btn btn-neutral" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Current password</span></label>
              <input
                type="password"
                className="input input-bordered"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">New password</span></label>
              <input
                type="password"
                className="input input-bordered"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm new password</span></label>
              <input
                type="password"
                className="input input-bordered"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-neutral" disabled={saving}>
              {saving ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
