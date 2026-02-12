// Levenshtein distance
function coreLevenshtein(aChars, aLen, bChars, bLen) {
  // Use two rolling rows to save memory
  const prev = [];
  const curr = [];

  let i = 0;
  while (i <= aLen) {
    prev[i] = i;
    i = i + 1;
  }

  let j = 1;
  while (j <= bLen) {
    curr[0] = j;
    i = 1;
    while (i <= aLen) {
      const match = aChars[i - 1] === bChars[j - 1] ? 0 : 1;

      const del = prev[i] + 1;
      const ins = curr[i - 1] + 1;
      const sub = prev[i - 1] + match;

      let best = del;
      if (ins < best) best = ins;
      if (sub < best) best = sub;

      curr[i] = best;
      i = i + 1;
    }

    // swap rows
    i = 0;
    while (i <= aLen) {
      const tmp = prev[i];
      prev[i] = curr[i];
      curr[i] = tmp;
      i = i + 1;
    }

    j = j + 1;
  }

  return prev[aLen];
}

// Public Levenshtein wrapper – allowed to use JS helpers outside core function
export function levenshtein(a, b) {
  const aLen = a ? a.length : 0;
  const bLen = b ? b.length : 0;

  const aChars = [];
  const bChars = [];

  let i = 0;
  while (i < aLen) {
    aChars[i] = a[i];
    i = i + 1;
  }

  i = 0;
  while (i < bLen) {
    bChars[i] = b[i];
    i = i + 1;
  }

  return coreLevenshtein(aChars, aLen, bChars, bLen);
}

// Similarity score

export function similarityScore(a, b) {
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);

  const lenA = a.length;
  const lenB = b.length;
  const maxLen = lenA > lenB ? lenA : lenB;

  if (maxLen === 0) return 0;

  const score = 1 - distance / maxLen;
  return score >= 0.5 ? score : 0;
}

export function meaningfulScore(score, query) {
  const len = query.length;
  if (len <= 3) return score >= 0.6;
  if (len <= 6) return score >= 0.7;
  return score >= 0.5;
}

// Book ranking

export function rankBooks(books, query) {
  const q = query.toLowerCase();

  // Split tokens manually (on spaces) to avoid using built-in split and regex
  const tokens = [];
  let current = "";
  let idx = 0;
  while (idx < q.length) {
    const ch = q[idx];
    if (ch === " " || ch === "\t" || ch === "\n") {
      if (current !== "") {
        tokens[tokens.length] = current;
        current = "";
      }
    } else {
      current = current + ch;
    }
    idx = idx + 1;
  }
  if (current !== "") {
    tokens[tokens.length] = current;
  }

  const ranked = [];

  let bi = 0;
  while (bi < books.length) {
    const book = books[bi];
    let score = 0;
    let priority = 99;

    const title = book.title ? book.title.toLowerCase() : "";
    const author = book.author ? book.author.toLowerCase() : "";
    const description = book.description ? book.description.toLowerCase() : "";
    const category =
      book.categoryID && book.categoryID.name
        ? book.categoryID.name.toLowerCase()
        : "";

    // best-match helper using only manual loops
    function best(text, weight, p) {
      let bestMatch = 0;
      let ti = 0;
      while (ti < tokens.length) {
        const t = tokens[ti];

        // simple includes check (manual)
        let contains = false;
        let pi = 0;
        while (!contains && pi + t.length <= text.length) {
          let k = 0;
          let ok = true;
          while (k < t.length) {
            if (text[pi + k] !== t[k]) {
              ok = false;
              break;
            }
            k = k + 1;
          }
          if (ok) contains = true;
          pi = pi + 1;
        }

        const rawScore = contains ? 1 : similarityScore(t, text);
        if (rawScore > bestMatch) bestMatch = rawScore;

        ti = ti + 1;
      }

      if (bestMatch > 0) {
        if (p < priority) priority = p;
        score = score + bestMatch * weight;
      }
    }

    best(title, 5, 0);
    best(category, 4, 1);
    best(author, 2.5, 3);
    best(description, 1, 5);

    // genres
    if (book.genres && book.genres.length) {
      let gMatch = 0;
      let gi = 0;
      while (gi < book.genres.length) {
        const g = String(book.genres[gi]).toLowerCase();
        let ti = 0;
        while (ti < tokens.length) {
          const t = tokens[ti];

          // simple includes check
          let contains = false;
          let pi = 0;
          while (!contains && pi + t.length <= g.length) {
            let k = 0;
            let ok = true;
            while (k < t.length) {
              if (g[pi + k] !== t[k]) {
                ok = false;
                break;
              }
              k = k + 1;
            }
            if (ok) contains = true;
            pi = pi + 1;
          }

          const rawScore = contains ? 1 : similarityScore(t, g);
          if (rawScore > gMatch) gMatch = rawScore;

          ti = ti + 1;
        }
        gi = gi + 1;
      }

      if (gMatch > 0) {
        if (2 < priority) priority = 2;
        score = score + gMatch * 3;
      }
    }

    if (meaningfulScore(score, query)) {
      const pos = ranked.length;
      ranked[pos] = { book, score, priority };
    }

    bi = bi + 1;
  }

  // Manual selection sort: highest relevance first, lowest priority number first
  const n = ranked.length;
  let i = 0;
  while (i < n - 1) {
    let bestIndex = i;
    let j = i + 1;
    while (j < n) {
      const a = ranked[j];
      const b = ranked[bestIndex];
      const better =
        a.priority < b.priority ||
        (a.priority === b.priority && a.score > b.score);
      if (better) bestIndex = j;
      j = j + 1;
    }
    if (bestIndex !== i) {
      const tmp = ranked[i];
      ranked[i] = ranked[bestIndex];
      ranked[bestIndex] = tmp;
    }
    i = i + 1;
  }

  return ranked;
}
