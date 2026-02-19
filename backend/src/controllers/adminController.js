import Admin from "../models/admin.js";
import Book from "../models/book.js";
import Order from "../models/order.js";
import Seller from "../models/seller.js";
import User from "../models/user.js";

export async function getAlladmin(req, res) {
  try {
    const admins = await Admin.find().lean();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAdmin(req, res) {
  try {
    const admin = await Admin.findById(req.params.id).lean();
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const createadmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(409).json({ message: "Admin already exists" });

    const ppImage = req.file ? req.file.path : null;

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      ppImage,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        ppImage: newAdmin.ppImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = admin.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", role: "admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAdminDashboardOverview = async (req, res) => {
  try {
    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
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

export const getDownloadsOverTime = async (req, res) => {
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
  res.status(200).json({ success: true, downloadsOverTime });
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
      { $project: { _id: 0, title: "$book.title", downloads: 1 } },
    ]);

    res.status(200).json({ success: true, topBooks });
  } catch (error) {
    console.error("Admin top books error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load top books" });
  }
};

/**
 * GET /api/admin/dashboard/sales-overview
 * High-level sales metrics for Sales Management page
 *
 * - totalSales: total revenue from paid orders (in Rs)
 * - totalOrders: total number of paid orders
 * - newCustomersToday: users created today
 * - avgOrderValue: revenue / totalOrders (in Rs)
 */
export const getAdminSalesOverview = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalOrders, newCustomersToday, revenueAgg] = await Promise.all([
      Order.countDocuments({ paymentStatus: "paid" }),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$priceAtPurchase" },
          },
        },
      ]),
    ]);

    const totalSales = revenueAgg[0]?.revenue || 0;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    res.status(200).json({
      success: true,
      cards: {
        totalSales,
        totalOrders,
        newCustomersToday,
        avgOrderValue,
      },
    });
  } catch (error) {
    console.error("Admin sales overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load sales overview",
    });
  }
};

/**
 * GET /api/admin/dashboard/user-signups
 * Users joined over time (by day)
 */
export const getUserSignupsOverTime = async (req, res) => {
  try {
    const userSignups = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    res.status(200).json({ success: true, userSignups });
  } catch (error) {
    console.error("Admin user signups error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load user signups",
    });
  }
};

/**
 * GET /api/admin/dashboard/seller-signups
 * Sellers joined over time (by day)
 */
export const getSellerSignupsOverTime = async (req, res) => {
  try {
    const sellerSignups = await Seller.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    res.status(200).json({ success: true, sellerSignups });
  } catch (error) {
    console.error("Admin seller signups error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load seller signups",
    });
  }
};

/**
 * GET /api/admin/dashboard/users
 * Paginated list of users with purchased books and total spent
 */
export const getAdminUsersTable = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    const match = {};
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [totalResults, users] = await Promise.all([
      User.countDocuments(match),
      User.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "orders",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$paymentStatus", "paid"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "books",
                  localField: "book",
                  foreignField: "_id",
                  as: "book",
                },
              },
              { $unwind: "$book" },
            ],
            as: "orders",
          },
        },
        {
          $addFields: {
            totalSpent: { $sum: "$orders.priceAtPurchase" },
            bookTitles: {
              $map: { input: "$orders", as: "o", in: "$$o.book.title" },
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            totalSpent: 1,
            bookTitles: 1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      page,
      limit,
      totalResults,
      totalPages: Math.ceil(totalResults / limit) || 1,
      data: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        totalSpent: u.totalSpent || 0,
        bookTitles: u.bookTitles || [],
      })),
    });
  } catch (error) {
    console.error("Admin users table error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

/**
 * GET /api/admin/dashboard/sellers
 * Paginated list of sellers for admin table
 */
export const getAdminSellersTable = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    const match = {};
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { storeName: { $regex: search, $options: "i" } },
      ];
    }

    const [totalResults, sellers] = await Promise.all([
      Seller.countDocuments(match),
      Seller.find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id name email phone storeName businessType")
        .lean(),
    ]);

    res.status(200).json({
      page,
      limit,
      totalResults,
      totalPages: Math.ceil(totalResults / limit) || 1,
      data: sellers.map((s) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        phone: s.phone || "",
        storeName: s.storeName || "",
        businessType: s.businessType || "",
      })),
    });
  } catch (error) {
    console.error("Admin sellers table error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load sellers",
    });
  }
};

/**
 * DELETE /api/admin/dashboard/users/:id
 */
export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

/**
 * DELETE /api/admin/dashboard/sellers/:id
 */
export const adminDeleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Seller.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Admin delete seller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete seller",
    });
  }
};

/**
 * POST /api/admin/dashboard/users
 * Create user (admin)
 */
export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Admin create user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

/**
 * PUT /api/admin/dashboard/users/:id
 * Update user basic info (admin)
 */
export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

/**
 * POST /api/admin/dashboard/sellers
 * Create seller (admin)
 */
export const adminCreateSeller = async (req, res) => {
  try {
    const { name, email, password, storeName, businessType, phone } = req.body;

    if (!name || !email || !password || !businessType) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and businessType are required",
      });
    }

    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Seller with this email already exists",
      });
    }

    const seller = await Seller.create({
      name,
      email,
      password,
      storeName,
      businessType,
      phone,
    });

    res.status(201).json({
      success: true,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        storeName: seller.storeName,
        businessType: seller.businessType,
      },
    });
  } catch (error) {
    console.error("Admin create seller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create seller",
    });
  }
};

/**
 * PUT /api/admin/dashboard/sellers/:id
 * Update seller basic info (admin)
 */
export const adminUpdateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, storeName, businessType, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (storeName !== undefined) updates.storeName = storeName;
    if (businessType) updates.businessType = businessType;
    if (phone !== undefined) updates.phone = phone;

    const seller = await Seller.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({
      success: true,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        storeName: seller.storeName,
        businessType: seller.businessType,
      },
    });
  } catch (error) {
    console.error("Admin update seller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update seller",
    });
  }
};

/**
 * GET /api/admin/dashboard/orders
 * Orders table: pagination, search by username, sort by username | amount | date
 */
export const getAdminOrdersTable = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const allowedSort = {
      username: "username",
      amount: "priceAtPurchase",
      date: "createdAt",
      id: "_id",
    };
    const sortKey = allowedSort[sortField] || "createdAt";

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDoc",
        },
      },
      { $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true } },
      { $addFields: { username: "$userDoc.name" } },
    ];

    const matchStage = {};
    if (search) {
      matchStage.username = { $regex: search, $options: "i" };
    }
    if (Object.keys(matchStage).length) pipeline.push({ $match: matchStage });

    const sortStage = { $sort: {} };
    sortStage.$sort[sortKey] = sortOrder;

    const countPipeline = [...pipeline, { $count: "total" }];
    const [countResult, orders] = await Promise.all([
      Order.aggregate(countPipeline),
      Order.aggregate([
        ...pipeline,
        sortStage,
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            username: 1,
            priceAtPurchase: 1,
            createdAt: 1,
          },
        },
      ]),
    ]);

    const totalResults = countResult[0]?.total ?? 0;

    res.status(200).json({
      page,
      limit,
      totalResults,
      totalPages: Math.ceil(totalResults / limit) || 1,
      data: orders.map((o) => ({
        id: o._id,
        username: o.username ?? "—",
        amount: o.priceAtPurchase ?? 0,
        date: o.createdAt
          ? new Date(o.createdAt).toISOString().split("T")[0]
          : "—",
      })),
    });
  } catch (error) {
    console.error("Admin orders table error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load orders",
    });
  }
};

/**
 * DELETE /api/admin/dashboard/orders
 * Body: { ids: string[] } — delete multiple orders
 */
export const adminDeleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array required",
      });
    }
    const result = await Order.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} order(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Admin delete orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete orders",
    });
  }
};

// ------------------------- Settings: Edit Profile -------------------------
/**
 * PUT /api/admin/settings/profile
 * Update current admin profile (name, userName, dateOfBirth, email, avatar)
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { name, userName, dateOfBirth, email } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (userName !== undefined) updates.userName = userName;
    if (dateOfBirth !== undefined)
      updates.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (email !== undefined) updates.email = email;
    if (req.file?.path) updates.ppImage = req.file.path;

    const admin = await Admin.findByIdAndUpdate(adminId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error("Update admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ------------------------- Settings: Security -------------------------
/**
 * PUT /api/admin/settings/password
 * Change current admin password (currentPassword, newPassword)
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change admin password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// ------------------------- Settings: Add Admin -------------------------
/**
 * GET /api/admin/dashboard/admins
 * List admins with search and sort by name (asc/dsc)
 */
export const getAdminAdminsTable = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const match = {};
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const [totalResults, admins] = await Promise.all([
      Admin.countDocuments(match),
      Admin.find(match)
        .sort({ name: sortOrder })
        .skip(skip)
        .limit(limit)
        .select("-password")
        .lean(),
    ]);

    res.status(200).json({
      page,
      limit,
      totalResults,
      totalPages: Math.ceil(totalResults / limit) || 1,
      data: admins.map((a) => ({
        id: a._id,
        name: a.name,
        userName: a.userName || "",
        email: a.email,
        ppImage: a.ppImage,
        dateOfBirth: a.dateOfBirth,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin admins table error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admins",
    });
  }
};

/**
 * DELETE /api/admin/dashboard/admins/:id
 * Delete an admin (cannot delete self)
 */
export const adminDeleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const currentId = req.user._id.toString();

    if (id === currentId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Admin delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};

/**
 * GET /api/admin/dashboard/admins/export
 * Export admins list as CSV
 */
export const exportAdmins = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const match = {};
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const admins = await Admin.find(match)
      .sort({ name: sortOrder })
      .select("name userName email createdAt")
      .lean();

    const header = "Name,User Name,Email,Created At\n";
    const rows = admins
      .map(
        (a) =>
          `"${(a.name || "").replace(/"/g, '""')}","${(a.userName || "").replace(/"/g, '""')}","${(a.email || "").replace(/"/g, '""')}","${a.createdAt ? new Date(a.createdAt).toISOString() : ""}"`,
      )
      .join("\n");
    const csv = header + rows;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=admins.csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error("Export admins error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export admins",
    });
  }
};
