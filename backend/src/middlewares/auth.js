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
      return res
        .status(404)
        .json({ message: `No account with that email`, status: "error" });
    }

    // Check if temporarily blocked
    if (
      seller.passwordResetBlockedUntil &&
      seller.passwordResetBlockedUntil > Date.now()
    ) {
      return res.status(429).json({
        message: "Too many reset attempts. Try again later.",
        status: "error",
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

    const LOGO_URL =
      "https://raw.githubusercontent.com/AvisarBhandari/Book-Store/main/frontend/src/assets/Logo.png";

    await sendEmail(
      email,
      "Reset Your Password – Read Verse",
      `
  <div style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" 
            style="background:#ffffff; border-radius:10px; padding:40px; 
            box-shadow:0 6px 20px rgba(0,0,0,0.08);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:25px;">
                <img src="${LOGO_URL}" alt="" 
                  width="130" style="display:block;" />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom:15px;">
                <h2 style="margin:0; color:#000000; font-size:24px;">
                  Reset Your Password
                </h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#333333; font-size:16px; 
                line-height:26px; padding-bottom:30px; text-align:center;">
                We received a request to reset your password for your 
                <strong>Read Verse</strong> account.
                <br/><br/>
                Click the button below to set a new password.
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <a href="${resetURL}"
                  style="
                    background-color:#000000;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 30px;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                    font-size:16px;
                    letter-spacing:0.5px;
                  ">
                  RESET PASSWORD
                </a>
              </td>
            </tr>

            <!-- Expiry Notice -->
            <tr>
              <td style="color:#777777; font-size:14px; 
                text-align:center; padding-bottom:20px;">
                This link will expire in 10 minutes for security reasons.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:25px 0;">
                <hr style="border:none; border-top:1px solid #eeeeee;" />
              </td>
            </tr>

            <!-- Fallback -->
            <tr>
              <td style="font-size:12px; color:#999999; text-align:center;">
                If the button doesn’t work, copy and paste this link into your browser:<br/><br/>
                <span style="word-break:break-all;">${resetURL}</span>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:30px; text-align:center; 
                font-size:12px; color:#aaaaaa;">
                © ${new Date().getFullYear()} Read Verse. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `,
    );

    res
      .status(200)
      .json({ message: "Reset link sent to email", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
export const UserforgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: `No account with that email`, status: "error" });
    }

    // Check if temporarily blocked
    if (
      user.passwordResetBlockedUntil &&
      user.passwordResetBlockedUntil > Date.now()
    ) {
      return res.status(429).json({
        message: "Too many reset attempts. Try again later.",
        status: "error",
      });
    }

    //  Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    user.passwordResetAttempts = 0;

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/user/reset-password/${resetToken}`;

    const LOGO_URL =
      "https://raw.githubusercontent.com/AvisarBhandari/Book-Store/main/frontend/src/assets/Logo.png";

    await sendEmail(
      email,
      "Reset Your Password – Read Verse",
      `
  <div style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" 
            style="background:#ffffff; border-radius:10px; padding:40px; 
            box-shadow:0 6px 20px rgba(0,0,0,0.08);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:25px;">
                <img src="${LOGO_URL}" alt="" 
                  width="130" style="display:block;" />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom:15px;">
                <h2 style="margin:0; color:#000000; font-size:24px;">
                  Reset Your Password
                </h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#333333; font-size:16px; 
                line-height:26px; padding-bottom:30px; text-align:center;">
                We received a request to reset your password for your 
                <strong>Read Verse</strong> account.
                <br/><br/>
                Click the button below to set a new password.
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <a href="${resetURL}"
                  style="
                    background-color:#000000;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 30px;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                    font-size:16px;
                    letter-spacing:0.5px;
                  ">
                  RESET PASSWORD
                </a>
              </td>
            </tr>

            <!-- Expiry Notice -->
            <tr>
              <td style="color:#777777; font-size:14px; 
                text-align:center; padding-bottom:20px;">
                This link will expire in 10 minutes for security reasons.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:25px 0;">
                <hr style="border:none; border-top:1px solid #eeeeee;" />
              </td>
            </tr>

            <!-- Fallback -->
            <tr>
              <td style="font-size:12px; color:#999999; text-align:center;">
                If the button doesn’t work, copy and paste this link into your browser:<br/><br/>
                <span style="word-break:break-all;">${resetURL}</span>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:30px; text-align:center; 
                font-size:12px; color:#aaaaaa;">
                © ${new Date().getFullYear()} Read Verse. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `,
    );

    res
      .status(200)
      .json({ message: "Reset link sent to email", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // max 5 requests per IP
  message: "Too many password reset requests. Try again later.",
});
