import Admin from "../models/admin.js";
import Book from "../models/book.js";
import Order from "../models/order.js";
import User from "../models/user.js";
export async function getAlladmin(req, res) {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const admin = await Admin.findById(id).select(
      "name email ppImage createdAt updatedAt",
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

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
export const updateadmin = async (req, res) => {
  try {
    const adminId = req.user._id;
    const updates = req.body;
    const updatedadmin = await Admin.findByIdAndUpdate(adminId, updates, {
      new: true,
    });
    res.status(200).json({
      message: "admin updated successfully",
      admin: updatedadmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

/**
 * GET /api/admin/dashboard
 * Admin dashboard overview
 */
export const getAdminDashboardOverview = async (req, res) => {
  try {
    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Aggregate dashboard data in parallel
    const [totalBooks, totalUsers, totalSales, todaySales, revenueAgg] =
      await Promise.all([
        Book.countDocuments({ status: "approved" }), // total books
        User.countDocuments(), // total users
        Order.countDocuments({ paymentStatus: "paid" }), // total sales
        Order.countDocuments({
          paymentStatus: "paid",
          createdAt: { $gte: startOfToday },
        }), // today sales
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, revenue: { $sum: "$priceAtPurchase" } } },
        ]),
      ]);

    const revenue = revenueAgg[0]?.revenue || 0;

    // Downloads over time (daily)
    const downloadsOverTime = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    // Top 5 books by sales
    const topBooks = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: "$book", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      { $project: { _id: 0, title: "$book.title", count: 1 } },
    ]);

    res.status(200).json({
      success: true,
      cards: { totalBooks, totalUsers, totalSales, todaySales, revenue },
      downloadsOverTime,
      topBooks,
    });
  } catch (error) {
    console.error("Admin dashboard overview error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load dashboard data" });
  }
};

/**
 * GET /api/admin/dashboard/top-books
 * Top 10 performing books globally
 */
export const getTopPerformingBooks = async (req, res) => {
  try {
    const topBooks = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: "$book", downloads: { $sum: 1 } } },
      { $sort: { downloads: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
    ]);

    res.status(200).json({ success: true, topBooks });
  } catch (error) {
    console.error("Admin top books error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load top books" });
  }
};
