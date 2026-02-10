import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ------------------ validation ------------------ */
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------ submit ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log(data);

      navigate("/");
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[528px] w-[954px] rounded-xl bg-white">
      <NavLink to="/" className="flex items-center">
        <img src={Logo} alt="Logo" className="h-12 w-auto ml-3 mt-3" />
      </NavLink>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center mt-2"
      >
        <h2 className="text-3xl font-semibold">Log in to your account</h2>
        <h2 className="my-1 pb-2">Enter your details below</h2>

        {/* EMAIL */}
        <div className="relative w-full max-w-lg mb-2 group">
          <CiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
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

        {/* PASSWORD */}
        <div className="relative w-full max-w-lg mb-2 group">
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

        {errors.api && (
          <p className="text-red-500 text-sm mb-2">{errors.api}</p>
        )}

        <div className="flex items-center justify-between w-full max-w-lg mb-4">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>

          <NavLink
            to="/forgot-password"
            className="text-sm text-[#232F3E] hover:underline"
          >
            Forgot password?
          </NavLink>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral rounded-xl w-full max-w-lg hover:bg-white hover:text-black"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="pt-10 grid grid-row-2 gap-1 text-center">
        <p>Don’t have an account?</p>
        <NavLink
          to="/register"
          className="text-sm text-[#232F3E] hover:underline"
        >
          Create one →
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
