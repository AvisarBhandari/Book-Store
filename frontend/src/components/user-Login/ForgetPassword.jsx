import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-hot-toast";
import { EmailValidation } from "../../utils/validation";

function ForgetPassword() {
  const navigate = useNavigate(); // <-- added
  const [formData, setFormData] = useState({
    email: "",
  });
  const [sendEmail, setSendEmail] = useState(false);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const loginNavigate = () => {
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};

    const emailError = EmailValidation(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    setLoading(true);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5001/api/user/forgot-password",
        { email: formData.email },
      );

      if (response.data?.status === "success") {
        setSendEmail(true);
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

  if (!sendEmail) {
    return (
      <div className="h-[528px] w-[954px] rounded-xl bg-white p-6">
        <NavLink to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-12 w-auto ml-3 mt-3" />
        </NavLink>

        <div className="flex flex-col items-center justify-center mt-2">
          <h2 className="text-3xl font-semibold pb-2">Forget Password</h2>
          <h2 className="my-1 pb-11">
            Enter your email to reset your password
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <div className="relative w-full mb-6 group">
              <CiMail
                className={`absolute left-3  -translate-y-1/2 text-gray-400 group-focus-within:text-primary ${errors.email ? "top-1/3" : " top-1/2"}`}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full pl-10"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-neutral rounded-xl w-full hover:bg-white hover:text-black"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="pt-10 text-center">
            <p>Already have an account?</p>
            <NavLink
              to="/login"
              className="text-sm hover:underline translate-x-1"
            >
              Log in →
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
  if (sendEmail) {
    return (
      <div className="h-[528px] w-[954px] rounded-xl bg-white p-6">
        <NavLink to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-12 w-auto ml-3 mt-3" />
        </NavLink>

        <div className="flex flex-col items-center justify-center mt-2">
          <h2 className="text-2xl font-semibold pb-3">
            We've sent a password reset link to your email
          </h2>
          <h2 className="my-1 pb-2 items-center text-center">
            If you don't receive the email within a few minutes, please check
            your spam folder or try again.
            <br />
            <strong>Meanwhile, you can close this page.</strong>
          </h2>

          <form onSubmit={loginNavigate} className="w-full max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full mb-6 group pb-14">
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-neutral rounded-xl w-full hover:bg-white hover:text-black"
            >
              {loading ? "...." : "Log In"}
            </button>
          </form>

          <div className="pt-10 text-center">
            <p>Already have an account?</p>
            <NavLink
              to="/login"
              className="text-sm hover:underline translate-x-1"
            >
              Log in →
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
