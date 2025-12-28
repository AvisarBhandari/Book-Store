import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/user.js";

export const buyBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, paymentMethod } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Prevent duplicate purchase
    const alreadyBought = await Order.findOne({
      user: userId,
      book: bookId,
      paymentStatus: "paid",
    });

    if (alreadyBought) {
      return res.status(400).json({ message: "Book already purchased" });
    }

    // Create order
    const order = await Order.create({
      user: userId,
      book: bookId,
      seller: book.seller,
      priceAtPurchase: book.finalPrice || book.price,
      paymentMethod,
      paymentStatus: "paid", //  payment success
    });

    // Update user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedBooks: bookId },
    });

    // Update book
    await Book.findByIdAndUpdate(bookId, {
      $inc: { soldCount: 1 },
    });

    res.status(201).json({
      message: "Book purchased successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("book")
      .populate("seller", "name email");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ seller: sellerId })
      .populate("book")
      .populate("user", "name email");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("book")
      .populate("user", "name email")
      .populate("seller", "name email");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("book")
      .populate("user", "name email")
      .populate("seller", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
