import React from "react";
import bgImage from "../../assets/login-bg.png";
import ResetPassword from "../../components/user-Login/ResetPassword.jsx";

const ResetPasswordPage = () => {
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
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;
