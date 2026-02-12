import Order from "../models/order.js";
import Book from "../models/book.js";
import User from "../models/user.js";

export const buyBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const rawBookId = req.body.bookId;
    const bookId = rawBookId ? String(rawBookId).split('?')[0].trim() : null;
    const paymentMethod = req.body.paymentMethod;
    if (!bookId) {
      return res.status(400).json({ message: "bookId required" });
    }

    const book = await Book.findById(bookId);
    console.log(userId);
    console.log(book);
    if (!book) return res.status(404).json({ message: "Book not found" });

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
      paymentStatus: "paid",
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

export const buyMultipleBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookIds, paymentMethod } = req.body;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: "bookIds array required" });
    }

    const sanitizedIds = [
      ...new Set(
        bookIds
          .map((id) => String(id).split("?")[0].trim())
          .filter(Boolean),
      ),
    ];

    if (!sanitizedIds.length) {
      return res.status(400).json({ message: "No valid bookIds provided" });
    }

    const books = await Book.find({ _id: { $in: sanitizedIds } });
    const booksMap = new Map(books.map((b) => [String(b._id), b]));

    const ordersToCreate = [];

    for (const id of sanitizedIds) {
      const book = booksMap.get(id);
      if (!book) continue;

      const alreadyBought = await Order.findOne({
        user: userId,
        book: id,
        paymentStatus: "paid",
      });

      if (alreadyBought) continue;

      ordersToCreate.push({
        user: userId,
        book: id,
        seller: book.seller,
        priceAtPurchase: book.finalPrice || book.price,
        paymentMethod,
        paymentStatus: "paid",
      });
    }

    if (!ordersToCreate.length) {
      return res
        .status(400)
        .json({ message: "All selected books are already purchased" });
    }

    const orders = await Order.insertMany(ordersToCreate);

    // Update user purchasedBooks
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedBooks: { $each: sanitizedIds } },
    });

    // Update soldCount for each book
    await Book.updateMany(
      { _id: { $in: sanitizedIds } },
      { $inc: { soldCount: 1 } },
    );

    res.status(201).json({
      message: "Books purchased successfully",
      count: orders.length,
      orders,
    });
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
