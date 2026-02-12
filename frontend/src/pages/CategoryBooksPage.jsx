import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import BookCard from "../components/bookCard.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function CategoryBooksPage() {
  const { identifier } = useParams();
  const [category, setCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(
          `${API}/categorie/${encodeURIComponent(identifier)}`
        );
        const cat = catRes.data?.categorie || catRes.data;
        setCategory(cat);
        const name = cat?.name || identifier;
        const booksRes = await axios.get(`${API}/book`, {
          params: { category: name },
        });
        setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      } catch (err) {
        console.error(err);
        setCategory(null);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [identifier]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow px-4 py-8 max-w-6xl mx-auto w-full">
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link>
          {" / "}
          <Link to="/categories" className="hover:underline">Categories</Link>
          {" / "}
          <span className="text-gray-800">
            {category?.name || identifier}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">
          {category?.name || identifier}
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="text-gray-500">No books in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((b) => (
              <BookCard key={b._id} bookId={b._id} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
