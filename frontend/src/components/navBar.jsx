import React from "react";
import logo from "../assets/Logo.png";
import { NavLink } from "react-router";
import SearchBar from "./SearchBar";

const navLinkClass = ({ isActive }) =>
  `
  relative inline-block px-4 py-2 rounded-md transition-all duration-300
  ${isActive ? "after:scale-x-100 font-bold " : ""}
  relative inline-block
               after:content-['']
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-full
               after:bg-current
               after:scale-x-0 after:origin-left
               after:transition-transform after:duration-500
               hover:after:scale-x-100 
  `;

const NavBar = () => {
  return (
    <div className="bg-base-100 shadow-sm">
      <div className="grid grid-cols-3 items-center px-6 lg:px-20 h-20">
        {/* LEFT */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </NavLink>
        </div>

        {/* CENTER (TRUE CENTER) */}
        <div className="flex justify-center">
          <ul className="flex justify-evenly w-full font-semibold text-gray-700">
            <li>
              <NavLink to="/" className={navLinkClass}>
                Book
              </NavLink>
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

        {/* RIGHT (Search + Buttons) */}
        <div className="flex items-center justify-end gap-10">
          <SearchBar />
          <div className="flex gap-3">
            <button className="btn btn-outline w-20 btn-sm">Login</button>
            <button className="btn btn-neutral btn-sm w-20 hover:text-black hover:bg-white">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
