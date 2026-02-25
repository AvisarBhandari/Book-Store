import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  NameValidation,
  EmailValidation,
  DisplayNameValidation,
  PasswordValidation,
  ProfileImageValidation,
} from "../../utils/validation";

const SellerSettingsPages = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("editProfile"); // "editProfile" or "security"

  // Edit profile state
  const [editProfileData, setEditProfileData] = useState({
    name: "",
    email: "",
    storeName: "",
    businessType: "",
  });
  const [isModified, setIsModified] = useState(false);

  // Avatar state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Modal state
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  // Fetch seller profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/seller/profile",
          { withCredentials: true },
        );
        setSeller(res.data.user);
        setEditProfileData({
          name: res.data.user.name,
          email: res.data.user.email,
          storeName: res.data.user.storeName,
          businessType: res.data.user.businessType,
        });
        if (res.data.user.ppImage) {
          setAvatarPreview(`http://localhost:5001/${res.data.user.ppImage}`);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Track changes in edit profile fields
  useEffect(() => {
    if (!seller) return;
    const modified =
      editProfileData.name !== seller.name ||
      editProfileData.email !== seller.email ||
      editProfileData.storeName !== seller.storeName ||
      editProfileData.businessType !== seller.businessType;
    setIsModified(modified);
  }, [editProfileData, seller]);
  const validateProfile = () => {
    let newErrors = {};

    const nameError = NameValidation(editProfileData.name);
    const emailError = EmailValidation(editProfileData.email);
    const displayError = DisplayNameValidation(editProfileData.storeName);
    const avatarError = avatarFile ? ProfileImageValidation(avatarFile) : null;

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (displayError) newErrors.storeName = displayError;
    if (avatarError) newErrors.avatar = avatarError;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // Update profile API
  const handleUpdateProfile = async () => {
    try {
      setSavingProfile(true);
      setProfileMessage({ type: "", text: "" });

      const formData = new FormData();
      formData.append("name", editProfileData.name);
      formData.append("email", editProfileData.email);
      formData.append("storeName", editProfileData.storeName);
      formData.append("businessType", editProfileData.businessType);
      if (avatarFile) {
        formData.append("ppseller", avatarFile);
      }

      const res = await axios.put(
        "http://localhost:5001/api/seller/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success("Profile updated successfully");
      setSeller(res.data.seller);
      setIsModified(false);
      setConfirmModalOpen(false);
      setProfileMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      setProfileMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password API
  const handleChangePassword = async () => {
    try {
      await axios.put(
        "http://localhost:5001/api/seller/change-password",
        securityData,
        { withCredentials: true },
      );
      toast.success("Password changed successfully");
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Navigation */}
      <div className="relative mb-6 border-b border-base-300">
        <div className="flex gap-8 relative">
          {["editProfile", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-lg transition-colors duration-200 ${
                activeTab === tab
                  ? "font-bold text-primary"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              {tab === "editProfile" ? "Edit Profile" : "Security"}

              {activeTab === tab && (
                <div className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-primary rounded-full transition-all duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "editProfile" && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Avatar */}
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
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                    e.target.value = "";
                  }}
                />
              </div>
              <span className="text-xs text-base-content/60">Change photo</span>
              {errors.avatar && (
                <p className="text-error text-xs">{errors.avatar}</p>
              )}
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={editProfileData.name}
                onChange={(e) =>
                  setEditProfileData({
                    ...editProfileData,
                    name: e.target.value,
                  })
                }
              />
              {errors.name && (
                <p className="text-error text-xs">{errors.name}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={editProfileData.email}
                onChange={(e) =>
                  setEditProfileData({
                    ...editProfileData,
                    email: e.target.value,
                  })
                }
              />
              {errors.email && (
                <p className="text-error text-xs">{errors.email}</p>
              )}
              <input
                type="text"
                placeholder="Store Name"
                className="input input-bordered w-full"
                value={editProfileData.storeName}
                onChange={(e) =>
                  setEditProfileData({
                    ...editProfileData,
                    storeName: e.target.value,
                  })
                }
              />
              {errors.storeName && (
                <p className="text-error text-xs">{errors.storeName}</p>
              )}
              <select
                className="select select-bordered w-full"
                value={editProfileData.businessType}
                onChange={(e) =>
                  setEditProfileData({
                    ...editProfileData,
                    businessType: e.target.value,
                  })
                }
              >
                <option value="self-publish">Self-publish</option>
                <option value="publisher">Publisher</option>
              </select>
            </div>
          </div>

          {profileMessage.text && (
            <div
              className={`alert ${
                profileMessage.type === "success"
                  ? "alert-success"
                  : "alert-error"
              }`}
            >
              <span>{profileMessage.text}</span>
            </div>
          )}

          <button
            className={`btn btn-primary mt-2 ${
              !isModified && !avatarFile ? "btn-disabled" : ""
            }`}
            onClick={() => {
              if (!validateProfile()) return;
              setConfirmModalOpen(true);
            }}
            disabled={!isModified && !avatarFile}
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-4 max-w-md">
          <input
            type="password"
            placeholder="Current Password"
            className="input input-bordered w-full"
            value={securityData.currentPassword}
            onChange={(e) =>
              setSecurityData({
                ...securityData,
                currentPassword: e.target.value,
              })
            }
          />
          {errors.currentPassword && (
            <p className="text-error text-xs">{errors.currentPassword}</p>
          )}
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full"
            value={securityData.newPassword}
            onChange={(e) =>
              setSecurityData({ ...securityData, newPassword: e.target.value })
            }
          />
          {errors.newPassword && (
            <p className="text-error text-xs">{errors.newPassword}</p>
          )}
          <input
            type="password"
            placeholder="Confirm New Password"
            className="input input-bordered w-full"
            value={securityData.confirmPassword}
            onChange={(e) =>
              setSecurityData({
                ...securityData,
                confirmPassword: e.target.value,
              })
            }
          />
          {errors.confirmPassword && (
            <p className="text-error text-xs">{errors.confirmPassword}</p>
          )}
          <button
            className="btn btn-primary mt-4"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Changes</h3>
            <p className="py-4">Are you sure you want to save these changes?</p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateProfile}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSettingsPages;
