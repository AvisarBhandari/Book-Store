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
    // Build suggestions using manual loops (no map/flatMap)
    const suggestions = [];
    let idx = 0;

    // Book titles
    let i = 0;
    while (i < bookTitles.length) {
      const b = bookTitles[i];
      suggestions[idx] = {
        type: "book",
        value: b.title,
        bookId: b._id,
        coverImage: b.coverImage,
      };
      idx = idx + 1;
      i = i + 1;
    }

    // Authors
    i = 0;
    while (i < authors.length) {
      const a = authors[i];
      suggestions[idx] = {
        type: "author",
        value: a.author,
      };
      idx = idx + 1;
      i = i + 1;
    }

    // Genres
    i = 0;
    while (i < genres.length) {
      const g = genres[i];
      let gi = 0;
      const gArr = g.genres || [];
      while (gi < gArr.length) {
        const x = gArr[gi];
        if (regex.test(x)) {
          suggestions[idx] = {
            type: "genre",
            value: x,
          };
          idx = idx + 1;
        }
        gi = gi + 1;
      }
      i = i + 1;
    }

    // Categories
    i = 0;
    while (i < categories.length) {
      const c = categories[i];
      suggestions[idx] = {
        type: "category",
        value: c.name,
      };
      idx = idx + 1;
      i = i + 1;
    }

    // Sellers
    i = 0;
    while (i < sellers.length) {
      const s = sellers[i];
      suggestions[idx] = {
        type: "seller",
        value: s.storeName || s.name,
      };
      idx = idx + 1;
      i = i + 1;
    }

    // Deduplicate by type+value (case-insensitive) and limit to 8
    const unique = [];
    i = 0;
    while (i < suggestions.length && unique.length < 8) {
      const cur = suggestions[i];
      const curKeyType = cur.type;
      const curValLower = cur.value.toLowerCase();

      let found = false;
      let j = 0;
      while (j < unique.length) {
        const u = unique[j];
        if (
          u.type === curKeyType &&
          u.value.toLowerCase() === curValLower
        ) {
          found = true;
          break;
        }
        j = j + 1;
      }

      if (!found) {
        unique[unique.length] = cur;
      }
      i = i + 1;
    }

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
