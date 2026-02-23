import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import bgimg from "../../assets/sellbg1.png";
import Logo from "../../assets/Logo.png";
import { CiMail } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  NameValidation,
  EmailValidation,
  PasswordValidation,
  PhoneValidation,
  StoreNameValidation,
} from "../../utils/validation";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Step 2
  const [businessData, setBusinessData] = useState({
    storeName: "",
    businessType: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};

    // console.log("Validating Step 1 with data:", personalData);
    const nameError = NameValidation(personalData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = EmailValidation(personalData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = PasswordValidation(personalData.password);
    if (passwordError) newErrors.password = passwordError;

    if (personalData.password !== personalData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    console.log("Validating Step 2 with data:", businessData);
    const phoneError = PhoneValidation(businessData.phone);
    if (phoneError) newErrors.phone = phoneError;
    const storeNameError = StoreNameValidation(
      businessData.storeName,
      businessData.businessType,
    );
    if (storeNameError) newErrors.storeName = storeNameError;
    if ( businessData.businessType== "") {
      newErrors.businessType = "Business type is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...restPersonal } = personalData;

      const payload = {
        ...restPersonal,
        ...businessData,
      };

      const response = await axios.post(
        "http://localhost:5001/api/seller/create",
        payload,
      );

      toast.success(response.data.message);
      navigate("/seller-login");
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Image Side */}
      <div
        className={`relative md:w-1/2 h-64 md:h-auto flex items-center justify-center transition-transform duration-500 ${
          step === 1 ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundImage: `url(${bgimg})`, backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-white text-3xl md:text-4xl font-bold text-center px-4">
          {step === 1 ? "Register as a Seller" : "Complete Your Store Info"}
        </h1>
      </div>

      {/* Form Side */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-50 min-h-screen p-8">
        <div className="w-full max-w-lg flex flex-col justify-between h-full">
          <NavLink to="/" className="flex justify-start mb-6">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
          </NavLink>

          <div className="flex flex-col flex-grow justify-center">
            {step === 1 && (
              <>
                <h2 className="text-3xl font-semibold mb-1">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-6">Step 1 of 2</p>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    className="input input-bordered w-full"
                    value={personalData.name}
                    onChange={(e) =>
                      setPersonalData({ ...personalData, name: e.target.value })
                    }
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}

                  <div className="relative">
                    <CiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="input input-bordered w-full pl-10"
                      value={personalData.email}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          email: e.target.value,
                        })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="input input-bordered w-full pl-10"
                      value={personalData.password}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          password: e.target.value,
                        })
                      }
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="input input-bordered w-full pl-10"
                      value={personalData.confirmPassword}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-neutral w-full rounded-xl"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-3xl font-semibold mb-1">
                  Store Information
                </h2>
                <p className="text-gray-600 mb-6">Step 2 of 2</p>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Store Name"
                    className="input input-bordered w-full"
                    value={businessData.storeName}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        storeName: e.target.value,
                      })
                    }
                  />
                  {errors.storeName && (
                    <p className="text-red-500">{errors.storeName}</p>
                  )}

                  <select
                    className="input input-bordered w-full"
                    value={businessData.businessType}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        businessType: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Business Type
                    </option>
                    <option value="self-publish">Self-Publisher</option>
                    <option value="publisher">Publisher</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500">{errors.businessType}</p>
                  )}

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="input input-bordered w-full"
                    value={businessData.phone}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        phone: e.target.value,
                      })
                    }
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone}</p>
                  )}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn btn-outline rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="btn btn-neutral rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
