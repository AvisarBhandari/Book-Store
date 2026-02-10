import React from "react";
import bgImage from "../../assets/login-bg.png";
import Login from "../../components/user-Login/Login.jsx";
const LoginPages = () => {
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
      <div>
        <Login />
      </div>
    </div>
  );
};

export default LoginPages;
