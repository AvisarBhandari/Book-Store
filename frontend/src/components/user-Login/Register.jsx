import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  NameValidation,
  EmailValidation,
  PasswordValidation,
} from "../../utils/validation";

function Register() {
  const navigate = useNavigate(); // <-- added
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};

    const nameError = NameValidation(formData.name);
    if (nameError) newErrors.name = nameError;
    const emailError = EmailValidation(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    const passwordError = PasswordValidation(formData.password);
    if (passwordError) newErrors.password = passwordError;
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (!formData.agreeTerms) {
      return toast.error("You must agree to the Terms & Conditions");
    } else {
      try {
        setLoading(true);
        const res = await axios.post("http://localhost:5001/api/user/create", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success(res.data.message);
        console.log("User created:", res.data.user);

        // Redirect to login page
        navigate("/login");

        // Reset form (optional since we are redirecting)
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false,
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Something went wrong, try again",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[528px] w-[954px] rounded-xl bg-white p-6">
      <NavLink to="/" className="flex items-center">
        <img src={Logo} alt="Logo" className="h-12 w-auto ml-3 mt-3" />
      </NavLink>

      <div className="flex flex-col items-center justify-center mt-2">
        <h2 className="text-3xl font-semibold ">Create an Account </h2>
        <h2 className="my-1 pb-2">Sign up to explore books</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className={`relative w-full group mb-6`}>
              <FaUser
                className={`absolute left-3  -translate-y-1/2 text-gray-400 group-focus-within:text-primary ${errors.name ? "top-1/3" : " top-1/2"}`}
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full pl-10"
              />
              {errors.name && (
                <p className="text-red-500 text-sm ">{errors.name}</p>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm">
              I agree to the{" "}
              <NavLink
                to="/terms-of-service"
                className="underline font-semibold mx-1"
              >
                Terms & Conditions
              </NavLink>{" "}
              and{" "}
              <NavLink
                to="/privacy-policy"
                className="underline font-semibold mx-1"
              >
                Privacy Policy
              </NavLink>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-neutral rounded-xl w-full hover:bg-white hover:text-black"
          >
            {loading ? "Registering..." : "Register"}
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

export default Register;
