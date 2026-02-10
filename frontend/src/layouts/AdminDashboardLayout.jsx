import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CiHome, CiSettings, CiMenuBurger } from "react-icons/ci";
import { FaBook, FaRegUser, FaArrowTrendUp } from "react-icons/fa6";
import logo from "../assets/Logo.png";

// ------------------------- Menu -------------------------
const menu = [
  { name: "Dashboard", icon: <CiHome />, path: "/admin" },
  { name: "Book Management", icon: <FaBook />, path: "/admin/book-management" },
  { name: "Users", icon: <FaRegUser />, path: "/admin/user-management" },
  { name: "Sales", icon: <FaArrowTrendUp />, path: "/admin/sales" },
  { name: "Settings", icon: <CiSettings />, path: "/admin/settings" },
];

// ------------------------- Fetch Admin Profile -------------------------
export const getAdminProfile = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/admin/profile", {
      credentials: "include",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getAdminProfile error:", err);
    return null;
  }
};

// ------------------------- Admin Dashboard Layout -------------------------
const AdminDashboardLayout = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- Load Admin Profile ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      const res = await getAdminProfile();

      if (!res || res.role !== "admin") {
        navigate("/"); // redirect if not admin
        return;
      }

      setAdmin(res.user);
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:5001/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  const currentPage =
    menu.find(
      (m) => m.path !== "/admin" && location.pathname.startsWith(m.path),
    )?.name || null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-base-100 border-r transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <ul className="menu px-4 py-6 gap-2">
          {menu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 text-base ${
                    isActive ? "active font-semibold" : ""
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* -------- TOP BAR -------- */}
        <header className="h-16 bg-base-100 border-b px-6 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <CiMenuBurger size={22} />
            </button>

            {/* Breadcrumb */}
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <button
                    onClick={() => navigate("/admin")}
                    className="link link-hover"
                  >
                    Dashboard
                  </button>
                </li>
                {currentPage && <li>{currentPage}</li>}
              </ul>
            </div>
          </div>

          {/* Right - Avatar */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost flex items-center gap-3"
            >
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      admin.ppImage
                        ? `http://localhost:5001/${admin.ppImage}`
                        : "https://via.placeholder.com/40"
                    }
                    alt="avatar"
                  />
                </div>
              </div>

              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold">{admin.name}</div>
                <div className="text-xs opacity-60 capitalize">
                  {/* fallback if businessType is missing */}
                  {admin.businessType
                    ? admin.businessType.replace("-", " ")
                    : "Admin"}
                </div>
              </div>
            </label>

            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => navigate("/admin/settings")}>
                  Settings
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </header>

        {/* -------- PAGE CONTENT -------- */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
