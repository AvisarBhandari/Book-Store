import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../Loader";
import { PasswordValidation } from "../../utils/validation";

function ResetPassword() {
  const navigate = useNavigate(); // <-- added
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { token } = useParams();
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const passwordError = PasswordValidation(formData.password);

    if (passwordError) newErrors.password = passwordError;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${token}`,
        {
          password: formData.password,
        },
      );
      if (response.status === 429) {
        // 1. Identify the rate limit
        console.error("Rate limit exceeded!");
        toast.error(
          response.data.message ||
            "Too many attempts. Please wait and try again later.",
        );
        return;
      }
      toast.success(response.data.message || "Password updated successfully");

      navigate("/login"); // redirect after success
    } catch (err) {
      setErrors({
        api:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="h-[528px] w-[954px] rounded-xl bg-white p-6 flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }
  return (
    <div className="h-[528px] w-[954px] rounded-xl bg-white p-6">
      <NavLink to="/" className="flex items-center">
        <img src={Logo} alt="Logo" className="h-12 w-auto ml-3 mt-3" />
      </NavLink>

      <div className="flex flex-col items-center justify-center mt-2">
        <h2 className="text-3xl font-semibold ">Reset Password</h2>
        <h2 className="my-1 pb-2">Enter your new password</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="grid grid-rows-2 gap-4">
            <div className="relative w-full mb-6 group">
              <FaLock
                className={`absolute left-3  -translate-y-1/2 text-gray-400 group-focus-within:text-primary ${errors.password ? "top-1/3" : " top-1/2"}`}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full pl-10"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm col-span-2 ">
                  {errors.confirmPassword}
                </p>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm  col-span-2">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="relative w-full mb-6 group">
              <FaLock
                className={`absolute left-3  -translate-y-1/2 text-gray-400 group-focus-within:text-primary ${errors.confirmPassword ? "top-1/3" : " top-1/2"}`}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full pl-10"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm col-span-2">
                  {errors.confirmPassword}
                </p>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm col-span-2">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-neutral rounded-xl w-full hover:bg-white hover:text-black"
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
