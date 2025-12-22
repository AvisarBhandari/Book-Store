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

    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "seller") {
      account = await Seller.findById(decoded.id).select("-password");
    } else if (decoded.role === "user") {
      account = await User.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = account;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

