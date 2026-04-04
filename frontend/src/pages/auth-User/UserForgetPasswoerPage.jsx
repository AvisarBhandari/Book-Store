import React from "react";
import bgImage from "../../assets/login-bg.png";
import ForgetPassword from "../../components/user-Login/ForgetPassword.jsx";

const UserForgetPasswordPage = () => {
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
      <ForgetPassword />
    </div>
  );
};

export default UserForgetPasswordPage;
