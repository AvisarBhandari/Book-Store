import Book from "../models/book.js";

const filterBooks = async (req, res) => {
  try {
    const {
      genre,
      discount,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      sellerId,
    } = req.query;

    const query = { status: "approved" };

    if (genre) query.genres = genre;
    if (discount === "true") query.discountPercentage = { $gt: 0 };

    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    if (sellerId) query.seller = sellerId;

    let booksQuery = Book.find(query);

    if (sort === "new") booksQuery.sort({ createdAt: -1 });
    if (sort === "bestseller") booksQuery.sort({ soldCount: -1 });
    if (sort === "discount") booksQuery.sort({ discountPercentage: -1 });
    if (sort === "price-low") booksQuery.sort({ finalPrice: 1 });
    if (sort === "price-high") booksQuery.sort({ finalPrice: -1 });

    const skip = (page - 1) * limit;
    const books = await booksQuery.skip(skip).limit(Number(limit));
    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default filterBooks;
