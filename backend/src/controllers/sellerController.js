// controllers/sellerController.js
import fs from "fs";
import Book from "../models/Book.js";
import Seller from "../models/seller.js";
import Order from "../models/order.js";
import { json2csv } from "json-2-csv";
import crypto from "crypto";
/* ---------- SELLER CONTROLLERS ---------- */
export async function getAllSeller(req, res) {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const seller = await Seller.findById(req.user._id);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const isMatch = await seller.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    seller.password = newPassword;
    await seller.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const seller = await Seller.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    //  Check brute-force attempts
    if (seller.passwordResetAttempts >= 5) {
      seller.passwordResetBlockedUntil = Date.now() + 15 * 60 * 1000; // 15 min block
      await seller.save();

      return res.status(429).json({
        message: "Too many failed attempts. Try again later.",
      });
    }

    //  Update password
    seller.password = password;

    // Clear reset fields
    seller.passwordResetToken = undefined;
    seller.passwordResetExpires = undefined;
    seller.passwordResetAttempts = 0;
    seller.passwordResetBlockedUntil = undefined;

    await seller.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createSeller = async (req, res) => {
  try {
    const { name, email, password, storeName, businessType, phone } = req.body;
    if (!name || !email || !password || !businessType || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller)
      return res.status(409).json({ message: "Seller already exists" });

    const ppImage = req.file ? req.file.path : null;

    const newSeller = await Seller.create({
      name,
      email,
      password,
      storeName,
      businessType,
      phone,
      ppImage,
    });

    res.status(201).json({
      message: "Seller created successfully",
      seller: {
        id: newSeller._id,
        name: newSeller.name,
        email: newSeller.email,
        storeName: newSeller.storeName,
        businessType: newSeller.businessType,
        ppImage: newSeller.ppImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function updateSeller(req, res) {
  try {
    const sellerId = req.user._id;
    const updates = { ...req.body };

    // If a new profile picture is uploaded, update ppImage (and avatarType)
    if (req.file && req.file.path) {
      updates.ppImage = req.file.path;
      updates.avatarType = "uploaded";
    }

    const updatedSeller = await Seller.findByIdAndUpdate(sellerId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Seller updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await seller.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = seller.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", role: "seller" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function deleteSeller(req, res) {
  try {
    const SellerId = req.user._id;
    const seller = await Seller.findById(SellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await Seller.findByIdAndDelete(SellerId);

    if (seller.ppImage && fs.existsSync(seller.ppImage)) {
      fs.unlinkSync(seller.ppImage);
    }

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

/* ---------- DASHBOARD CONTROLLERS ---------- */
export const getSellerDashboardOverview = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalBooks, totalSales, todaySales, revenueAgg] = await Promise.all([
      Book.countDocuments({ seller: sellerId }),
      Order.countDocuments({ seller: sellerId, paymentStatus: "paid" }),
      Order.countDocuments({
        seller: sellerId,
        paymentStatus: "paid",
        createdAt: { $gte: startOfToday },
      }),
      Order.aggregate([
        { $match: { seller: sellerId, paymentStatus: "paid" } },
        { $group: { _id: null, revenue: { $sum: "$priceAtPurchase" } } },
      ]),
    ]);

    const revenue = revenueAgg[0]?.revenue || 0;

    const downloadsOverTime = await Order.aggregate([
      { $match: { seller: sellerId, paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    const topBooks = await Order.aggregate([
      { $match: { seller: sellerId, paymentStatus: "paid" } },
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
      cards: { totalBooks, totalSales, todaySales, revenue },
      downloadsOverTime,
      topBooks,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

export const getTopPerformingBooks = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const topBooks = await Order.aggregate([
      { $match: { seller: sellerId, paymentStatus: "paid" } },
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
    res.status(200).json(topBooks);
  } catch (error) {
    console.error("Top books error:", error);
    res.status(500).json({ message: "Failed to load top books" });
  }
};

/* ---------- BOOK ROUTES ---------- */
export const getSellerBooks = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { search, sortField, sortOrder, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let filter = { seller: sellerId };
    if (search?.trim())
      filter.$or = [
        { title: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ];

    let sort = {};
    if (sortField) {
      const order = sortOrder === "desc" ? -1 : 1;
      const allowed = ["author", "category", "soldCount", "price"];
      if (allowed.includes(sortField)) sort[sortField] = order;
    } else sort = { createdAt: -1 };

    const books = await Book.find(filter)
      .populate("categoryID", "name")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalResults = await Book.countDocuments(filter);

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalResults,
      totalPages: Math.ceil(totalResults / limit),
      data: books.map((b) => ({
        id: b._id,
        title: b.title,
        author: b.author,
        discountPercentage: b.discountPercentage,
        description: b.description,
        category: b.category,
        categoryID: b.categoryID?._id,
        coverImage: b.coverImage,
        downloads: b.soldCount,
        price: b.price,
        finalPrice: b.finalPrice,
        createdAt: b.createdAt,
      })),
    });
  } catch (err) {
    console.error("Seller book list error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const exportSellerBooks = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const books = await Book.find({ seller: sellerId }).lean();

    const exportData = books.map((b) => ({
      title: b.title,
      author: b.author,
      category: b.category,
      downloads: b.soldCount,
      price: b.price,
      finalPrice: b.finalPrice,
      createdAt: b.createdAt,
    }));

    const csv = await json2csv(exportData, { prependHeader: true });

    res.header("Content-Type", "text/csv");
    res.attachment(`seller_${sellerId}_books.csv`);
    res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: err.message });
  }
};
