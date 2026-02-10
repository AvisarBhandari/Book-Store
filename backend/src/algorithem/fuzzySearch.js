// Levenshtein distance
export function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) matrix[j][i] = matrix[j - 1][i - 1];
      else
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
        );
    }
  }

  return matrix[b.length][a.length];
}

export function similarityScore(a, b) {
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  const score = 1 - distance / maxLen;
  return score >= 0.5 ? score : 0;
}

export function meaningfulScore(score, query) {
  const len = query.length;
  if (len <= 3) return score >= 0.6;
  if (len <= 6) return score >= 0.7;
  return score >= 0.5;
}

export function rankBooks(books, query) {
  const tokens = query.toLowerCase().split(/\s+/);

  return books
    .map((book) => {
      let score = 0;
      let priority = 99;

      const title = book.title?.toLowerCase() || "";
      const author = book.author?.toLowerCase() || "";
      const description = book.description?.toLowerCase() || "";
      const category = book.categoryID?.name?.toLowerCase() || "";

      const best = (text, weight, p) => {
        const match = Math.max(
          ...tokens.map((t) =>
            text.includes(t) ? 1 : similarityScore(t, text),
          ),
        );
        if (match > 0) {
          priority = Math.min(priority, p);
          score += match * weight;
        }
      };

      best(title, 5, 0);
      best(category, 4, 1);
      best(author, 2.5, 3);
      best(description, 1, 5);

      if (book.genres?.length) {
        const gMatch = Math.max(
          ...book.genres.flatMap((g) =>
            tokens.map((t) =>
              g.toLowerCase().includes(t)
                ? 1
                : similarityScore(t, g.toLowerCase()),
            ),
          ),
        );
        if (gMatch > 0) {
          priority = Math.min(priority, 2);
          score += gMatch * 3;
        }
      }

      return { book, score, priority };
    })
    .filter((r) => meaningfulScore(r.score, query))
    .sort((a, b) =>
      a.priority !== b.priority ? a.priority - b.priority : b.score - a.score,
    );
}
