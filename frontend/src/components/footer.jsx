import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import logo from "../assets/Logo.png";
import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[#f7f4f2] text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Contact Info */}
          <div className="space-y-7 text-sm">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <div className="flex items-center pb-3">
                <NavLink to="/" className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="h-10 w-auto" />
                </NavLink>
              </div>
            </div>
            <div className="space-y-7">
              <p className="leading-relaxed">
                Parsa Bazaar, Mahendra Hwy,
                <br />
                Khairahani 44202
              </p>

              <p>
                <span className="font-medium">Phone:</span>{" "}
                <a
                  href="tel:+9779823671584"
                  className="hover:text-gray-900 transition"
                >
                  +977 9823671584
                </a>
                <br />
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:info@ReadVerse.com"
                  className="hover:text-gray-900 transition"
                >
                  info@ReadVerse.com
                </a>
              </p>
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-7 text-sm">
            <h4 className=" text-gray-900 font-bold">Useful Links</h4>
            <ul className="space-y-6">
              <li className="hover:text-primary transition-all duration-300 ease-in-out">
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="hover:text-primary transition-all duration-300 ease-in-out">
                <NavLink to="/about">About us</NavLink>
              </li>
              <li className="hover:text-primary transition-all duration-300 ease-in-out">
                <NavLink to="/termsofservice">Terms of service</NavLink>
              </li>
              <li className="hover:text-primary transition-all duration-300 ease-in-out">
                <NavLink to="/privacypolicy">Privacy Policy</NavLink>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div className="space-y-7 text-sm">
            <h4 className="font-bold text-gray-900">Genres</h4>
            <ul className="space-y-6">
              {["Fiction", "Self Help", "Business", "Children"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-primary transition-all duration-300 ease-in-out"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-gray-900">Follow Us</h4>
            <p className="leading-relaxed">
              Stay connected and informed about new book launches, events, and
              updates.
            </p>

            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 border rounded-full text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-300 pt-4 text-center text-xs text-gray-600">
          © Copyright <span className="font-bold">ReadVerse</span> All Rights
          Reserved
        </div>
      </div>
    </footer>
  );
}
