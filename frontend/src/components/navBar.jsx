import React from "react";
import logo from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const formatPrice = (v) => Number(v).toFixed(2);

const navLinkClass = ({ isActive }) =>
  `relative inline-block px-4 py-2 transition-all duration-300
   after:content-[''] after:absolute after:left-0 after:bottom-0
   after:h-[2px] after:w-full after:bg-current
   after:scale-x-0 after:origin-left after:transition-transform after:duration-500
   hover:after:scale-x-100
   ${isActive ? "font-bold after:scale-x-100" : ""}`;

const NavBar = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, subtotal } = useCart();

  return (
    <div className="bg-base-100 shadow-sm">
      <div className="grid grid-cols-5 items-center px-6 lg:px-20 h-20">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </NavLink>

        {/* Nav Items */}
        <div className="flex justify-center col-span-2">
          <ul className="flex gap-5 font-semibold text-gray-700">
            {/* Book Dropdown */}
            <li>
              <div className="dropdown dropdown-hover group">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost hover:bg-transparent flex items-center gap-1"
                >
                  <NavLink to="/" className={navLinkClass}>
                    Book
                  </NavLink>
                  <FiChevronDown className="transition-transform duration-200 group-hover:rotate-180" />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <NavLink to="/categories">Categories</NavLink>
                  </li>
                  <li>
                    <NavLink to="/deals">Deals</NavLink>
                  </li>
                  <li>
                    <NavLink to="/best-selling">Best Selling</NavLink>
                  </li>
                  <li>
                    <NavLink to="/seller-login">Sell</NavLink>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <NavLink to="/browse" className={navLinkClass}>
                Browse
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <SearchBar />
        </div>

        {/* Cart + Auth */}
        <div className="flex justify-end items-center gap-4">
          {/* Cart */}
          <div className="dropdown dropdown-hover dropdown-end">
            <button className="btn btn-ghost btn-circle relative">
              <FiShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="badge badge-sm badge-neutral absolute -top-1 -right-1">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="dropdown-content bg-base-100 w-80 p-3 shadow rounded-xl z-[2]">
              <h4 className="font-semibold mb-2">My Cart</h4>

              {cart.length === 0 ? (
                <p className="text-sm text-gray-500">Cart is empty</p>
              ) : (
                <>
                  <ul className="space-y-2 max-h-60 overflow-auto">
                    {cart.map((item) => (
                      <li key={item._id} className="flex gap-3 items-start">
                        <img
                          src={`http://localhost:5001/${item.coverImage}`}
                          className="w-12 h-16 object-cover rounded"
                        />

                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            Rs {formatPrice(item.finalPrice)} × {item.quantity}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t mt-3 pt-2 flex justify-between text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>Rs {formatPrice(subtotal)}</span>
                  </div>

                  <button
                    onClick={() => navigate("/cart")}
                    className="btn btn-neutral btn-sm w-full mt-3"
                  >
                    Go to Cart
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Auth */}
          <button className="btn btn-outline btn-sm w-20">Login</button>
          <button className="btn btn-neutral btn-sm w-20 hover:bg-white hover:text-black">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
