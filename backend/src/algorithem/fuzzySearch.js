// Fully manual Levenshtein without wrapper
function levenshtein(a, b) {
  // manual lengths
  let aLen = 0;
  while (a[aLen] !== undefined) aLen++;
  let bLen = 0;
  while (b[bLen] !== undefined) bLen++;

  // rolling rows
  const prev = [];
  const curr = [];

  let i = 0;
  while (i <= aLen) {
    prev[i] = i;
    i++;
  }

  let j = 1;
  while (j <= bLen) {
    curr[0] = j;

    i = 1;
    while (i <= aLen) {
      const match = a[i - 1] === b[j - 1] ? 0 : 1;

      let del = prev[i] + 1;
      let ins = curr[i - 1] + 1;
      let sub = prev[i - 1] + match;

      let best = del;
      if (ins < best) best = ins;
      if (sub < best) best = sub;

      curr[i] = best;
      i++;
    }

    // swap rows manually
    i = 0;
    while (i <= aLen) {
      const tmp = prev[i];
      prev[i] = curr[i];
      curr[i] = tmp;
      i++;
    }

    j++;
  }

  return prev[aLen];
}

// Similarity score
export function similarityScore(a, b) {
  if (!a || !b) return 0;

  const distance = levenshtein(a, b);

  const lenA = getLength(a);
  const lenB = getLength(b);

  let maxLen = lenA > lenB ? lenA : lenB;
  if (maxLen === 0) return 0;

  const score = 1 - distance / maxLen;
  return score >= 0.5 ? score : 0;
}

function meaningfulScore(score, query) {
  const len = getLength(query);
  if (len <= 3) return score >= 3;
  if (len <= 6) return score >= 4;
  return score >= 2.5;
}
export function rankBooks(books, query) {
  // Convert query to lowercase manually
  let q = "";
  let i = 0;
  while (i < getLength(query)) {
    const c = query[i];
    q += c >= "A" && c <= "Z" ? String.fromCharCode(c.charCodeAt(0) + 32) : c;
    i++;
  }

  // Manual tokenization
  const tokens = [];
  let token = "";
  i = 0;
  while (i <= getLength(q)) {
    const ch = i < getLength(q) ? q[i] : " ";
    if (ch === " " || ch === "\t" || ch === "\n") {
      if (token !== "") {
        tokens[tokens.length] = token;
        token = "";
      }
    } else {
      token += ch;
    }
    i++;
  }

  // Normalize books manually
  const normalized = [];
  let bi = 0;
  while (bi < getLength(books)) {
    const book = books[bi];
    const norm = {
      book,
      title: toLower(book.title),
      author: toLower(book.author),
      description: toLower(book.description),
      category: toLower(book.categoryID?.name),
      genres: book.genres ? manualLowerArray(book.genres) : [],
    };
    normalized[normalized.length] = norm;
    bi++;
  }

  return coreRankBooks(normalized, tokens);
}

// Core ranking logic
function coreRankBooks(books, tokens) {
  const ranked = [];

  let bi = 0;
  while (bi < getLength(books)) {
    const item = books[bi];
    const book = item.book;

    let score = 0;
    let priority = 99;

    function best(text, weight, p) {
      let bestMatch = 0;

      let ti = 0;
      while (ti < getLength(tokens)) {
        const t = tokens[ti];

        let localBest = 0;
        let word = "";
        let i = 0;
        while (i <= getLength(text)) {
          const ch = i < getLength(text) ? text[i] : " ";
          if (ch === " " || ch === "\t" || ch === "\n") {
            if (word !== "") {
              localBest = Math.max(localBest, wordMatchScore(word, t));
              word = "";
            }
          } else {
            word += ch;
          }
          i++;
        }

        if (localBest > bestMatch) bestMatch = localBest;
        ti++;
      }

      if (bestMatch > 0) {
        if (p < priority) priority = p;
        score += bestMatch * weight;
      }
    }

    best(item.title, 5, 0);
    best(item.category, 4, 1);
    best(item.author, 2.5, 3);
    best(item.description, 0.5, 5);

    // genres
    let gi = 0;
    while (gi < getLength(item.genres)) {
      const g = item.genres[gi];
      let ti = 0;
      let gMatch = 0;
      while (ti < getLength(tokens)) {
        const t = tokens[ti];
        gMatch = Math.max(gMatch, wordMatchScore(g, t));
        ti++;
      }
      if (gMatch > 0) {
        if (2 < priority) priority = 2;
        score += gMatch * 3;
      }
      gi++;
    }

    if (priority <= 2 && score >= 4) {
      ranked[ranked.length] = { book, score, priority };
    }

    bi++;
  }

  // manual sort
  let i = 0;
  while (i < getLength(ranked) - 1) {
    let bestIndex = i;
    let j = i + 1;
    while (j < getLength(ranked)) {
      const a = ranked[j];
      const b = ranked[bestIndex];

      const better =
        a.priority < b.priority ||
        (a.priority === b.priority && a.score > b.score);

      if (better) bestIndex = j;

      j++;
    }

    if (bestIndex !== i) {
      const tmp = ranked[i];
      ranked[i] = ranked[bestIndex];
      ranked[bestIndex] = tmp;
    }

    i++;
  }

  return ranked;
}

// Manual helpers
function getLength(arrOrStr) {
  let len = 0;
  while (arrOrStr[len] !== undefined) len++;
  return len;
}

function toLower(str) {
  if (!str) return "";
  let out = "";
  let i = 0;
  while (i < getLength(str)) {
    const c = str[i];
    out += c >= "A" && c <= "Z" ? String.fromCharCode(c.charCodeAt(0) + 32) : c;
    i++;
  }
  return out;
}

function manualLowerArray(arr) {
  const out = [];
  let i = 0;
  while (i < getLength(arr)) {
    out[i] = toLower(String(arr[i]));
    i++;
  }
  return out;
}

function wordMatchScore(word, token) {
  // manual contains check + fallback to similarity score
  let contains = false;
  let pi = 0;
  while (!contains && pi + getLength(token) <= getLength(word)) {
    let k = 0;
    let ok = true;
    while (k < getLength(token)) {
      if (word[pi + k] !== token[k]) {
        ok = false;
        break;
      }
      k++;
    }
    if (ok) contains = true;
    pi++;
  }
  return contains ? 1 : similarityScore(token, word);
}
