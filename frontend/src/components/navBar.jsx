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
    <div className="bg-base-100 shadow-sm sticky z-50 ">
      <div className="grid grid-cols-6 items-center px-6 lg:px-20 h-20">
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
        <div className="flex justify-center col-span-2 ">
          <SearchBar />
        </div>

        {/* Cart + Auth */}
        <div className="flex justify-end items-center gap-4">
          {/* Cart */}
          <div className="dropdown dropdown-hover dropdown-end">
            <button className="btn btn-ghost btn-circle relative hover:bg-transparent hover:animate-bounce ">
              <FiShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="badge badge-sm badge-neutral absolute -top-1 -right-1">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="dropdown-content bg-base-100 w-80 p-3 shadow rounded-xl ">
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
                            Rs {formatPrice(item.finalPrice)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          <div className="group">
                            <svg
                              width="19"
                              height="22"
                              viewBox="0 0 19 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.53125 0C6.24594 0 6.01562 0.230313 6.01562 0.515625C6.01562 0.800937 6.24594 1.03125 6.53125 1.03125H11.6875C11.9728 1.03125 12.2031 0.800937 12.2031 0.515625C12.2031 0.230313 11.9728 0 11.6875 0H6.53125ZM2.23438 2.40625C1.00203 2.40625 0 3.40828 0 4.64062C0 5.87297 1.00203 6.875 2.23438 6.875H15.4688V17.7031C15.4688 19.3136 14.1573 20.625 12.5469 20.625H5.67188C4.06141 20.625 2.75 19.3136 2.75 17.7031V8.76562C2.75 8.48031 2.51969 8.25 2.23438 8.25C1.94906 8.25 1.71875 8.48031 1.71875 8.76562V17.7031C1.71875 19.8825 3.4925 21.6562 5.67188 21.6562H12.5469C14.7262 21.6562 16.5 19.8825 16.5 17.7031V6.81323C17.4831 6.57948 18.2188 5.69594 18.2188 4.64062C18.2188 3.40828 17.2167 2.40625 15.9844 2.40625H2.23438ZM2.23438 3.4375H15.9844C16.6478 3.4375 17.1875 3.97719 17.1875 4.64062C17.1875 5.30406 16.6478 5.84375 15.9844 5.84375H2.23438C1.57094 5.84375 1.03125 5.30406 1.03125 4.64062C1.03125 3.97719 1.57094 3.4375 2.23438 3.4375ZM6.70312 9.28125C6.41781 9.28125 6.1875 9.51156 6.1875 9.79688V17.7031C6.1875 17.9884 6.41781 18.2188 6.70312 18.2188C6.98844 18.2188 7.21875 17.9884 7.21875 17.7031V9.79688C7.21875 9.51156 6.98844 9.28125 6.70312 9.28125ZM11.5156 9.28125C11.2303 9.28125 11 9.51156 11 9.79688V17.7031C11 17.9884 11.2303 18.2188 11.5156 18.2188C11.8009 18.2188 12.0312 17.9884 12.0312 17.7031V9.79688C12.0312 9.51156 11.8009 9.28125 11.5156 9.28125Z"
                                fill="#52525B"
                                className="transition-colors duration-300 group-hover:fill-[#FF0004]"
                              />
                            </svg>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t mt-3 pt-2 flex justify-between text-sm font-semibold">
                    <span>Total</span>
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
          <div className=" hover:animate-bounce ">
            <div className="group">
              <svg
                width="20"
                height="24"
                viewBox="0 0 30 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 10V28.3333C0 32.0017 2.99 33.3333 5 33.3333H30V30H5.02C4.25 29.98 3.33333 29.6767 3.33333 28.3333C3.33333 26.99 4.25 26.6867 5.02 26.6667H30V3.33333C30 1.495 28.505 0 26.6667 0H5C2.99 0 0 1.33167 0 5V10ZM5 3.33333H26.6667V23.3333H3.33333V5C3.33333 3.65667 4.25 3.35333 5 3.33333Z"
                  fill="#373434"
                  fill-opacity="0.81"
                  className=""
                />
                <path
                  d="M14.9951 20L20.5784 14.5184C20.9226 14.1873 21.1965 13.7901 21.3836 13.3506C21.5707 12.9112 21.6671 12.4385 21.6671 11.9609C21.6671 11.4832 21.5707 11.0105 21.3836 10.5711C21.1965 10.1316 20.9226 9.73443 20.5784 9.40335C19.8844 8.71836 18.9485 8.33428 17.9734 8.33428C16.9983 8.33428 16.0624 8.71836 15.3684 9.40335L14.9951 9.76669L14.6217 9.40169C13.928 8.7168 12.9924 8.33276 12.0176 8.33276C11.0427 8.33276 10.1071 8.7168 9.41339 9.40169C9.06914 9.73277 8.79528 10.1299 8.6082 10.5694C8.42113 11.0089 8.32471 11.4816 8.32471 11.9592C8.32471 12.4368 8.42113 12.9095 8.6082 13.349C8.79528 13.7884 9.06914 14.1856 9.41339 14.5167L14.9951 20Z"
                  fill="#373434"
                  fill-opacity="0.81"
                  className="transition-colors duration-300 group-hover:fill-[#FF0004]"
                />
              </svg>
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
