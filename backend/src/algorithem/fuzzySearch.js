// Levenshtein distance
export function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) matrix[j][i] = matrix[j - 1][i - 1];
      else
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // replace
          matrix[j][i - 1] + 1, // insert
          matrix[j - 1][i] + 1 // delete
        );
    }
  }

  return matrix[b.length][a.length];
}

// Normalized similarity (0 to 1)
export function similarityScore(a, b) {
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  const score = 1 - distance / maxLen;

  // Only meaningful matches
  return score >= 0.5 ? score : 0;
}

// Check if score is meaningful based on query length
export function meaningfulScore(score, query) {
  const len = query.length;
  if (len <= 3) return score >= 1; // short query, exact match only
  if (len <= 6) return score >= 0.7; // slightly fuzzy allowed
  return score >= 0.5; // longer queries allow fuzziness
}

/**
 * Rank books by query
 * Returns array: { book, score, priority }
 */
export function rankBooks(books, query) {
  const q = query.toLowerCase();

  return books
    .map((book) => {
      let score = 0;
      let priority = 99;

      const title = book.title?.toLowerCase() || "";
      const author = book.author?.toLowerCase() || "";
      const description = book.description?.toLowerCase() || "";
      const category = book.catagorieID?.name?.toLowerCase() || "";

      // TITLE (highest priority)
      const titleMatch = title.includes(q) ? 1 : similarityScore(q, title);
      if (titleMatch > 0) {
        priority = 0;
        score += titleMatch * 5;
      }

      // CATEGORY
      const catMatch = category.includes(q) ? 1 : similarityScore(q, category);
      if (catMatch > 0) {
        priority = Math.min(priority, 1);
        score += catMatch * 4;
      }

      // GENRES
      let genreMatch = 0;
      if (book.genres?.length) {
        const exactGenre = book.genres.find((g) => g.toLowerCase().includes(q));
        if (exactGenre) genreMatch = 1;
        else
          genreMatch = Math.max(
            ...book.genres.map((g) => similarityScore(q, g.toLowerCase()))
          );
        if (genreMatch > 0) {
          priority = Math.min(priority, 2);
          score += genreMatch * 3;
        }
      }

      // AUTHOR
      const authorMatch = author.includes(q) ? 1 : similarityScore(q, author);
      if (authorMatch > 0) {
        priority = Math.min(priority, 3);
        score += authorMatch * 2.5;
      }

      // SELLER
      if (book.seller) {
        const sellerName = book.seller.name?.toLowerCase() || "";
        const storeName = book.seller.storeName?.toLowerCase() || "";
        const sellerMatch =
          sellerName.includes(q) || storeName.includes(q)
            ? 1
            : Math.max(
                similarityScore(q, sellerName),
                similarityScore(q, storeName)
              );
        if (sellerMatch > 0) {
          priority = Math.min(priority, 4);
          score += sellerMatch * 2;
        }
      }

      // DESCRIPTION
      const descMatch = description.includes(q)
        ? 1
        : similarityScore(q, description);
      if (descMatch > 0) {
        priority = Math.min(priority, 5);
        score += descMatch * 1;
      }

      return { book, score, priority };
    })
    .filter((item) => meaningfulScore(item.score, q)) // ✅ filter by meaningful similarity
    .sort((a, b) =>
      a.priority !== b.priority ? a.priority - b.priority : b.score - a.score
    );
}
