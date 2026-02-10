import Book from "../models/book.js";
import Category from "../models/Category.js";
import Seller from "../models/seller.js";
import { similarityScore, rankBooks } from "../algorithem/fuzzySearch.js";

export const searchBooks = async (req, res) => {
  try {
    const { q, filter, minPrice, maxPrice, minRating, genre, category } =
      req.query;

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

    /* -------- FETCH BOOKS -------- */
    const books = await Book.find({ status: "approved" })
      .populate("seller", "name storeName")
      .populate("categoryID", "name keywords")
      .lean();

    console.log("Books fetched:", books.length);

    /* -------- FUZZY RANKING -------- */
    let ranked = rankBooks(books, q);
    console.log("After rankBooks:", ranked.length);

    /* -------- CATEGORY + KEYWORD FILTER -------- */
    if (category || q) {
      ranked = filterByCategoryAndKeyword(ranked, q, category);
      console.log("After category/keyword filter:", ranked.length);
    }

    /* -------- RATING FILTER -------- */
    if (minRating) {
      const minR = parseFloat(minRating);
      ranked = ranked.filter((r) => {
        const keep = (r.book.ratings || 0) >= minR;
        if (!keep)
          console.log("Excluded by rating:", r.book.title, r.book.ratings);
        return keep;
      });
      console.log("After rating filter:", ranked.length);
    }

    /* -------- GENRE FILTER -------- */
    if (genre) {
      ranked = ranked.filter((r) => {
        const keep = r.book.genres?.includes(genre);
        if (!keep)
          console.log("Excluded by genre:", r.book.title, r.book.genres);
        return keep;
      });
      console.log("After genre filter:", ranked.length);
    }

    /* -------- PRICE FILTER -------- */
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    ranked = ranked.filter((r) => {
      const price = r.book.finalPrice ?? r.book.price;
      const keep = price >= min && price <= max;
      if (!keep) console.log("Excluded by price:", r.book.title, price);
      return keep;
    });
    console.log("After price filter:", ranked.length);

    /* -------- SORT FILTERS -------- */
    if (filter === "new") {
      ranked.sort(
        (a, b) => new Date(b.book.createdAt) - new Date(a.book.createdAt),
      );
    } else if (filter === "bestseller") {
      ranked.sort((a, b) => (b.book.soldCount || 0) - (a.book.soldCount || 0));
    } else if (filter === "discount") {
      ranked = ranked.filter((r) => r.book.discountPercentage > 0);
    } else if (filter === "rating") {
      ranked.sort((a, b) => (b.book.ratings || 0) - (a.book.ratings || 0));
    }

    /* -------- PAGINATION -------- */
    const totalResults = ranked.length;
    const totalPages = Math.ceil(totalResults / limit);

    const data = ranked.slice(skip, skip + limit).map((r) => r.book);

    console.log("Returning results:", data.length);

    res.json({
      page,
      limit,
      totalResults,
      totalPages,
      data,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------- CATEGORY + KEYWORD FILTER ----------------- */
export const filterByCategoryAndKeyword = (ranked, _keyword, category) => {
  const cat = category?.toLowerCase().trim();

  if (!cat) return ranked;

  return ranked.filter(({ book }) => {
    const categoryDoc = book.categoryID;
    if (!categoryDoc) return false;

    return categoryDoc.name?.toLowerCase() === cat;
  });
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
    const categories = await Category.find({ name: regex })
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
          })),
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
        suggestions.map((s) => [`${s.type}-${s.value.toLowerCase()}`, s]),
      ).values(),
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
