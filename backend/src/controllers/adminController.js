import Admin from "../models/admin.js";

export async function getAlladmin(req, res) {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const createadmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingadmin = await Admin.findOne({ email });
    if (existingadmin) {
      return res.status(409).json({ message: "admin already exists" });
    }

    const ppImage = req.file ? req.file.path : null;

    const newadmin = await Admin.create({
      name,
      email,
      password,
      ppImage,
    });

    res.status(201).json({
      message: "admin created successfully",
      admin: {
        id: newadmin._id,
        name: newadmin.name,
        email: newadmin.email,
        ppImage: newadmin.ppImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginadmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = admin.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
