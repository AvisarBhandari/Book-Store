import User from "../models/user.js";

export async function getAlluser(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id).select("name ppImage");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

    const newuser = await User.create({
      name,
      email,
      password,
      ppImage,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        ppImage: newuser.ppImage,
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
