import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import bgimg from "../../assets/sellbg1.png";
import Logo from "../../assets/Logo.png";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loader from '../Loader'
import { EmailValidation, PasswordValidation } from "../../utils/validation";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Basic validation
  const validate = () => {
    const newErrors = {};
    const emailError = EmailValidation(formData.email);
    const passwordError = PasswordValidation(formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://localhost:5001/api/seller/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // <-- important!
        },
      );

      if (response.data?.role === "seller") {
        toast.success(response.data.message);
        navigate("/seller");
      } else {
        setErrors({ api: "Unauthorized access" });
      }
    } catch (err) {
      setErrors({
        api:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    // Show loader while checking
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div
        className="relative md:w-1/2 h-64 md:h-auto flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-white text-3xl md:text-4xl font-bold text-center px-4">
          Log In To Update Your Inventory <br /> And Connect With Readers
        </h1>
      </div>

      {/* Right side - Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-50 min-h-screen">
        <div className="w-full max-w-lg p-8 flex flex-col justify-between h-full">
          <NavLink to="/" className="flex justify-start mb-6">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
          </NavLink>

          {/* Form */}
          <div className="flex flex-col justify-center flex-grow">
            <h2 className="text-3xl font-semibold mb-1">Seller Login</h2>
            <p className="text-gray-600 mb-6">
              Log in to manage your store and sell books
            </p>

            {errors.api && (
              <p className="text-red-500 mb-4 text-center">{errors.api}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <CiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <NavLink
                  to="/forgot-password"
                  className="text-[#232F3E] hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-neutral w-full rounded-xl hover:bg-white hover:text-black"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 text-center space-y-2">
            <p>Don’t have an account?</p>
            <NavLink
              to="/seller-register"
              className="text-sm text-[#232F3E] hover:underline"
            >
              Create one →
            </NavLink>

            <div className="mt-4 flex justify-between text-sm">
              <NavLink
                to="/privacy-policy"
                className="hover:underline text-[#232F3E]"
              >
                Privacy Policy
              </NavLink>
              <NavLink
                to="/terms-of-service"
                className="hover:underline text-[#232F3E]"
              >
                Terms of Service
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
