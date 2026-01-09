import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Book from "../models/book.js";
import mongoose from "mongoose";

export const createOrUpdateReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({ message: "Book & rating required" });
    }

    // Check purchase
    const hasPurchased = await Order.exists({
      user: req.user._id,
      book: bookId,
      paymentStatus: "paid",
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "Purchase required to review" });
    }

    // Create or update review
    let review = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment;

      await review.save();
    } else {
      review = await Review.create({
        user: req.user._id,
        book: bookId,
        rating,
        comment,
      });
    }

    await updateBookRating(bookId);

    res.status(200).json({ message: "Review saved", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateBookRating = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: new mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: "$book",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Book.findByIdAndUpdate(bookId, {
    averageRating: stats[0]?.avgRating || 0,
    reviewCount: stats[0]?.count || 0,
  });
};
export const getBookReviews = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const reviews = await Review.find({ book: req.params.bookId })
    .populate("user", "name ppImage")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(reviews);
};
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (
    req.role !== "admin" &&
    review.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await review.deleteOne();
  await updateBookRating(review.book);

  res.json({ message: "Review deleted" });
};
