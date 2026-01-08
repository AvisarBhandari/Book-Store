import Book from "../models/book.js";
import Categorie from "../models/Categorie.js";
import Seller from "../models/seller.js";
import { similarityScore, rankBooks } from "../algorithem/fuzzySearch.js";
import searchAnalytics from "../models/searchAnalytics.js";

export const searchBooks = async (req, res) => {
  try {
    const { q, filter, minPrice, maxPrice } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 12, 1);
    const skip = (page - 1) * limit;

    if (!q || q.trim() === "") {
      return res.json({
        page,
        limit,
        totalResults: 0,
        totalPages: 0,
        data: [],
      });
    }

    // Fetch approved books
    let books = await Book.find({ status: "approved" })
      .populate("seller", "name storeName")
      .populate("catagorieID", "name keywords")
      .lean();

    // Fuzzy search ranking
    let ranked = rankBooks(books, q);

    // Apply filter if provided
    if (filter === "new") {
      // Sort by creation date descending
      ranked.sort(
        (a, b) => new Date(b.book.createdAt) - new Date(a.book.createdAt)
      );
    } else if (filter === "bestseller") {
      // Sort by sold count descending
      ranked.sort((a, b) => (b.book.soldCount || 0) - (a.book.soldCount || 0));
    } else if (filter === "discount") {
      // Only include books with a discount
      ranked = ranked.filter((r) => r.book.discountPercentage > 0);
    }

    // Apply price range filter
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    ranked = ranked.filter((r) => {
      const price = r.book.finalPrice || r.book.price;
      return price >= min && price <= max;
    });

    const totalResults = ranked.length;
    const totalPages = Math.ceil(totalResults / limit);

    const paginatedResults = ranked
      .slice(skip, skip + limit)
      .map((r) => r.book);

    res.json({
      page,
      limit,
      totalResults,
      totalPages,
      data: paginatedResults,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") return res.json([]);

    const regex = new RegExp("^" + q, "i");

    // Book titles (+ cover image)
    const bookTitles = await Book.find({ title: regex })
      .limit(4)
      .select("_id title coverImage")
      .lean();

    // Authors
    const authors = await Book.find({ author: regex })
      .limit(3)
      .select("author")
      .lean();

    // Genres
    const genres = await Book.find({ genres: regex })
      .limit(3)
      .select("genres")
      .lean();

    // Categories
    const categories = await Categorie.find({ name: regex })
      .limit(3)
      .select("name")
      .lean();

    // Sellers
    const sellers = await Seller.find({
      $or: [{ name: regex }, { storeName: regex }],
    })
      .limit(3)
      .select("name storeName")
      .lean();

    // Normalize & merge
    const suggestions = [
      ...bookTitles.map((b) => ({
        type: "book",
        value: b.title,
        bookId: b._id,
        coverImage: b.coverImage,
      })),

      ...authors.map((a) => ({
        type: "author",
        value: a.author,
      })),

      ...genres.flatMap((g) =>
        g.genres
          .filter((x) => regex.test(x))
          .map((x) => ({
            type: "genre",
            value: x,
          }))
      ),

      ...categories.map((c) => ({
        type: "category",
        value: c.name,
      })),

      ...sellers.map((s) => ({
        type: "seller",
        value: s.storeName || s.name,
      })),
    ];

    // Deduplicate by value + type
    const unique = Array.from(
      new Map(
        suggestions.map((s) => [`${s.type}-${s.value.toLowerCase()}`, s])
      ).values()
    ).slice(0, 8);

    res.json(unique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logSearch = async ({ req, query, results }) => {
  try {
    await searchAnalytics.create({
      query,
      normalizedQuery: query.toLowerCase().trim(),
      resultsCount: results.length,
      impressions: results.slice(0, 10).map((book, index) => ({
        book: book._id,
        rank: index + 1,
      })),
      user: req.user?._id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (e) {
    console.error("Search analytics error:", e.message);
  }
};
