import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Seller from "../models/seller.js";
import User from "../models/user.js";

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
