import Order from "../models/order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

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
