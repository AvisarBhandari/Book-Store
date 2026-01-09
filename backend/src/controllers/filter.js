import Book from "../models/book.js";
import Seller from "../models/seller.js";

export const getFilterOptions = async (req, res) => {
  try {
    const [
      categories,
      genres,
      authors,
      languages,
      publishers,
      priceStats,
      sellers,
    ] = await Promise.all([
      Book.distinct("catagorie", { status: "approved" }),
      Book.distinct("genres", { status: "approved" }),
      Book.distinct("author", { status: "approved" }),
      Book.distinct("language", { status: "approved" }),
      Book.distinct("publisher", { status: "approved" }),
      Book.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$finalPrice" },
            maxPrice: { $max: "$finalPrice" },
          },
        },
      ]),
      Seller.find({ status: "approved" }).select("_id storeName"),
    ]);

    res.json({
      success: true,
      filters: {
        categories,
        genres,
        authors,
        languages,
        publishers,
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0 },
        sellers,
        discountAvailable: true,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const filterBooks = async (req, res) => {
  try {
    const {
      categories,
      genres,
      author,
      publisher,
      language,
      minRating,
      minPages,
      maxPages,
      discount,
      minPrice,
      maxPrice,
      sort,
      sellerId,
    } = req.query;

    const pageNum = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(req.query.limit, 10) || 12, 1);

    const query = { status: "approved" };

    if (categories) query.catagorie = { $in: categories.split(",") };
    if (genres) query.genres = { $in: genres.split(",") };
    if (author) query.author = { $in: author.split(",") };
    if (publisher) query.publisher = publisher;
    if (language) query.language = language;

    if (minRating) query.rating = { $gte: Number(minRating) };

    if (minPages || maxPages) {
      query.pages = {};
      if (minPages) query.pages.$gte = Number(minPages);
      if (maxPages) query.pages.$lte = Number(maxPages);
    }

    if (discount === "true") {
      query.discountPercentage = { $gt: 0 };
    }

    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    if (sellerId) query.seller = sellerId;

    let booksQuery = Book.find(query);

    if (sort) {
      const sortOptions = {};
      sort.split(",").forEach((s) => {
        if (s === "new") sortOptions.createdAt = -1;
        if (s === "bestseller") sortOptions.soldCount = -1;
        if (s === "discount") sortOptions.discountPercentage = -1;
        if (s === "rating") sortOptions.rating = -1;
        if (s === "price-low") sortOptions.finalPrice = 1;
        if (s === "price-high") sortOptions.finalPrice = -1;
      });
      booksQuery = booksQuery.sort(sortOptions);
    }

    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      booksQuery.skip(skip).limit(limitNum),
      Book.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      books,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
