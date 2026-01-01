import React from "react";
import logo from "../assets/Logo.png";
import { NavLink } from "react-router";
import SearchBar from "./SearchBar";

const NavBar = () => {
  return (
    <div className="bg-base-100 shadow-sm">
      <div className="grid grid-cols-3 items-center px-6 lg:px-20 h-20">
        {/* LEFT */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          </NavLink>
        </div>

        {/* CENTER (TRUE CENTER) */}
        <div className="flex justify-center">
          <ul className="flex gap-6 font-semibold">
            <li>
              <NavLink to="/" className="hover:text-primary">
                Book
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse" className="hover:text-primary">
                Browse
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-primary">
                About Us
              </NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT (Search + Buttons) */}
        <div className="flex items-center justify-end gap-10">
          <SearchBar />
          <div className="flex gap-3">

          <button className="btn btn-outline btn-sm">Login</button>
          <button className="btn btn-neutral btn-sm">Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
