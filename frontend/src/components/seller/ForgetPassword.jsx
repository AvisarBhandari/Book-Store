import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import bgimg from "../../assets/sellbg1.png";
import Logo from "../../assets/Logo.png";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loader from "../Loader";
import { EmailValidation } from "../../utils/validation";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSend, setEmailSend] = useState(false);
  const navigate = useNavigate();

  // Basic validation
  const validate = () => {
    const newErrors = {};
    const emailError = EmailValidation(formData.email);

    if (emailError) newErrors.email = emailError;

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
        "http://localhost:5001/api/seller/forgot-password",
        { email: formData.email },
      );

      if (response.data?.status === "success") {
        setEmailSend(true);
        toast.success(response.data.message);
      } else {
        setErrors({
          response: response.data?.message || "Something went wrong",
          status: response.data?.status || "error",
        });
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
      <div className="flex items-center justify-center min-h-screen ">
        <Loader />
      </div>
    );
  }
  if (!emailSend) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div
          className="relative md:w-1/2 h-64 md:h-auto flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bgimg})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <h1 className="relative text-white text-3xl md:text-4xl font-bold text-center px-4 ">
            Forget Password? <br />
            <br />
            Don’t worry, it happens to the best of us!
          </h1>
        </div>

        {/* Right side - Form */}
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 min-h-screen">
          <div className="w-full max-w-[44rem] p-8 flex flex-col justify-between h-full">
            <NavLink to="/" className="flex justify-start mb-6">
              <img src={Logo} alt="Logo" className="h-12 w-auto" />
            </NavLink>

            {/* Form */}
            <div className="flex flex-col justify-center flex-grow">
              <h2 className="text-3xl font-semibold mb-1">
                Forget your password?
                <br /> No worries, we’ve got you covered!
              </h2>
              <p className="text-gray-600 mb-6">
                Just enter your email address below, and we’ll send you a link
                to reset your password. It’s quick and easy!
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-neutral w-full rounded-xl hover:bg-white hover:text-black"
                >
                  {loading ? "Sending reset link..." : "Send Reset Link"}
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
  }
  if (emailSend) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div
          className="relative md:w-1/2 h-64 md:h-auto flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bgimg})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <h1 className="relative text-white text-3xl md:text-4xl font-bold text-center px-4 ">
            Set a new password for your account! <br />
          </h1>
        </div>

        {/* Right side - Form */}
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 min-h-screen">
          <div className="w-full max-w-[44rem] p-8 flex flex-col justify-between h-full">
            <NavLink to="/" className="flex justify-start mb-6">
              <img src={Logo} alt="Logo" className="h-12 w-auto" />
            </NavLink>

            {/* Form */}
            <div className="flex flex-col justify-center flex-grow">
              <h1 className="text-3xl font-semibold mb-1">
                Please Check your email for the reset link!
              </h1>
              <p className="text-gray-600 mb-6">
                You can close this window and check your email for the reset
                link.
              </p>
              <NavLink
                to="/seller-login"
                className="btn btn-neutral w-full rounded-xl hover:bg-white hover:text-black"
              >
                Back to Login
              </NavLink>
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
  }
};

export default ForgetPassword;
