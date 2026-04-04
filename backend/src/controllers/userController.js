import User from "../models/user.js";
import mongoose from "mongoose";
import { resolveAvatar } from "../services/avatar.resolver.js";
import crypto from "crypto";

export async function getAlluser(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export async function deleteuser(req, res) {
  try {
    const { id } = req.params;
    const deleteduser = await User.findByIdAndDelete(id);
    if (!deleteduser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const getUser = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "user id or name is required",
      });
    }

    let user;
    // If valid MongoDB ObjectId → search by _id
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    } else {
      // Case-insensitive name search
      user = await User.findOne({
        name: { $regex: `^${identifier}$`, $options: "i" },
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export async function getPurchasedBook(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("purchasedBooks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const avatar = await resolveAvatar({
      doc: User,
      file: req.file,
      name: updates.name,
      model: "user",
    });

    Object.assign(user, updates, avatar);
    await user.save();

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const createuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const ppImage = req.file ? req.file.path : null;

    const avatar = await resolveAvatar({
      doc: null,
      file: req.file,
      name,
      model: "user",
    });

    const newuser = await User.create({
      name,
      email,
      password,
      ppImage,
      ...avatar,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        ppImage: newuser.ppImage,
        avatarType: newuser.avatarType,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      role: "user",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Bookmarks fetched successfully",
      bookmarks: user.bookmarks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update current user profile (name, email, avatar)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (req.file?.path) updates.ppImage = req.file.path;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Change current user password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password required" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ADD or REMOVE a bookmark (userId from authenticated user)
export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: "bookId required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.bookmarks.findIndex((id) => id.toString() === bookId);
    let action;
    if (index === -1) {
      user.bookmarks.push(bookId);
      action = "added";
    } else {
      user.bookmarks.splice(index, 1);
      action = "removed";
    }
    await user.save();

    const updatedUser = await User.findById(userId).select("bookmarks");
    const bookmarkIds = (updatedUser.bookmarks || []).map((b) => b.toString());

    res.json({
      message: `Bookmark ${action} successfully`,
      bookmarks: bookmarkIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", status: "error" });
    }

    //  Check brute-force attempts
    if (user.passwordResetAttempts >= 5) {
      user.passwordResetBlockedUntil = Date.now() + 15 * 60 * 1000; // 15 min block
      await user.save();

      return res.status(429).json({
        message: "Too many failed attempts. Try again later.",
        status: "error",
      });
    }

    //  Update password
    user.password = password;

    // Clear reset fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetAttempts = 0;
    user.passwordResetBlockedUntil = undefined;

    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
