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
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: "approved" };

    /* CATEGORY */
    if (categories) {
      query.catagorie = { $in: categories.split(",") };
    }

    /* GENRES */
    if (genres) {
      query.genres = { $in: genres.split(",") };
    }

    /* AUTHOR (multi-select) */
    if (author) {
      query.author = { $in: author.split(",") };
    }

    /* PUBLISHER */
    if (publisher) {
      query.publisher = publisher;
    }

    /* LANGUAGE */
    if (language) {
      query.language = language;
    }

    /* RATING */
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    /* PAGE COUNT */
    if (minPages || maxPages) {
      query.pages = {};
      if (minPages) query.pages.$gte = Number(minPages);
      if (maxPages) query.pages.$lte = Number(maxPages);
    }

    /* DISCOUNT */
    if (discount === "true") {
      query.discountPercentage = { $gt: 0 };
    }

    /* PRICE */
    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    /* SELLER */
    if (sellerId) {
      query.seller = sellerId;
    }

    let booksQuery = Book.find(query);

    /* SORT */
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

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      booksQuery.skip(skip).limit(Number(limit)),
      Book.countDocuments(query),
    ]);

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
