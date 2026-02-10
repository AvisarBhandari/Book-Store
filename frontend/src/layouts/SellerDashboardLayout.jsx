import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CiHome, CiSettings, CiMenuBurger } from "react-icons/ci";
import { FaBook, FaRegUser, FaArrowTrendUp } from "react-icons/fa6";
import { getSellerProfile } from "../utils/auth";
import logo from "../assets/Logo.png";

const menu = [
  { name: "Dashboard", icon: <CiHome />, path: "/seller" },
  {
    name: "Book Management",
    icon: <FaBook />,
    path: "/seller/book-management",
  },
  { name: "Users", icon: <FaRegUser />, path: "/seller/user-management" },
  { name: "Sales", icon: <FaArrowTrendUp />, path: "/seller/sales" },
  { name: "Settings", icon: <CiSettings />, path: "/seller/settings" },
];

const SellerDashboardLayout = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      const res = await getSellerProfile();

      if (!res || res.role !== "seller") {
        navigate("/");
        return;
      }

      setSeller(res.user);
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:5001/api/seller/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  const currentPage =
    menu.find(
      (m) => m.path !== "/seller" && location.pathname.startsWith(m.path),
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
        className={`bg-base-100 border-r transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
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
                    onClick={() => navigate("/seller")}
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
                    src={`http://localhost:5001/${seller.ppImage}`}
                    alt="avatar"
                  />
                </div>
              </div>

              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold">{seller.name}</div>
                <div className="text-xs opacity-60 capitalize">
                  {seller.businessType.replace("-", " ")}
                </div>
              </div>
            </label>

            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => navigate("/seller/settings")}>
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

export default SellerDashboardLayout;
