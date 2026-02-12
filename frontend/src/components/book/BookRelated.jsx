import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../bookCard.jsx";
import axios from "axios";

const API = "http://localhost:5001/api/book";

export default function BookRelated({ book }) {
  const [byAuthor, setByAuthor] = useState([]);
  const [byCategory, setByCategory] = useState([]);

  useEffect(() => {
    if (!book) return;
    const currentId = book._id;

    const fetchAuthor = async () => {
      try {
        const res = await axios.get(API, {
          params: { author: book.author },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setByAuthor(list.filter((b) => b._id !== currentId).slice(0, 8));
      } catch {
        setByAuthor([]);
      }
    };

    const fetchCategory = async () => {
      try {
        const res = await axios.get(API, {
          params: { category: book.category },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setByCategory(list.filter((b) => b._id !== currentId).slice(0, 8));
      } catch {
        setByCategory([]);
      }
    };

    fetchAuthor();
    fetchCategory();
  }, [book]);

  if (!book) return null;

  const Section = ({ title, books, seeAllLink }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="text-sm text-blue-600 hover:underline">
            See all
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {books.map((b) => (
          <div key={b._id} className="flex-shrink-0 w-[280px]">
            <BookCard bookId={b._id} />
          </div>
        ))}
        {books.length === 0 && (
          <p className="text-gray-500 text-sm">No other books found.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[87rem] mx-auto px-4 py-8">
      {byAuthor.length > 0 && (
        <Section
          title={`More by ${book.author}`}
          books={byAuthor}
          seeAllLink={`/search?q=${encodeURIComponent(book.author)}`}
        />
      )}
      {byCategory.length > 0 && (
        <Section
          title={book.category ? `${book.category} / Similar Books` : "Similar Books"}
          books={byCategory}
          seeAllLink={book.category ? `/categories/${encodeURIComponent(book.category)}` : null}
        />
      )}
    </div>
  );
}
