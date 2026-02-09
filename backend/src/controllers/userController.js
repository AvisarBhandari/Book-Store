import User from "../models/user.js";
import mongoose from "mongoose";
import { resolveAvatar } from "../services/avatar.resolver.js";

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

// ADD or REMOVE a bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if book is already bookmarked
    const index = user.bookmarks.findIndex((id) => id.toString() === bookId);

    let action;
    if (index === -1) {
      // Not bookmarked, add it
      user.bookmarks.push(bookId);
      action = "added";
    } else {
      // Already bookmarked, remove it
      user.bookmarks.splice(index, 1);
      action = "removed";
    }

    await user.save();

    // Optionally, populate bookmarks to return full book data
    const updatedUser = await User.findById(userId).populate("bookmarks");

    res.json({
      message: `Bookmark ${action} successfully`,
      bookmarks: updatedUser.bookmarks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};