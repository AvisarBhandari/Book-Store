import React from "react";
import bgImage from "../../assets/login-bg.png";
import Register from "../../components/user-Login/Register.jsx";

const RegisterPages = () => {
  return (
    <div
      className="min-h-screen w-screen overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Register />
    </div>
  );
};

export default RegisterPages;
