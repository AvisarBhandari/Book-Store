import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Seller from "../models/seller.js";
import User from "../models/user.js";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { sendEmail } from "./email.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;

    switch (decoded.role) {
      case "admin":
        account = await Admin.findById(decoded.id).select("-password");
        break;
      case "seller":
        account = await Seller.findById(decoded.id).select("-password");
        break;
      case "user":
        account = await User.findById(decoded.id).select("-password");
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = account;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error("protect middleware error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Role-based access control
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({ message: `No account with that email` ,status:"error"});
    }

    // Check if temporarily blocked
    if (
      seller.passwordResetBlockedUntil &&
      seller.passwordResetBlockedUntil > Date.now()
    ) {
      return res.status(429).json({
        message: "Too many reset attempts. Try again later.",
        status: "error"
      });
    }

    //  Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    seller.passwordResetToken = hashedToken;
    seller.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    seller.passwordResetAttempts = 0;

    await seller.save();

    const resetURL = `${process.env.FRONTEND_URL}/seller/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Password Reset",
      `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 10 minutes.</p>
      `,
    );

    res.status(200).json({ message: "Reset link sent to email", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // max 5 requests per IP
  message: "Too many password reset requests. Try again later.",
});
