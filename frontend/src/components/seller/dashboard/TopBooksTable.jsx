import { useEffect, useState } from "react";
import axios from "axios";

const TopBooksTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateCover = (title) => {
    if (!title) return "https://via.placeholder.com/80x120?text=No+Title";
    const initials = title
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    return `https://via.placeholder.com/80x120?text=${initials}`;
  };

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5001/api/seller/dashboard/top-books",
          { withCredentials: true },
        );
        setBooks(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch top books:",
          err.response?.data || err.message,
        );
        setError("Failed to load top books");
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  if (loading) return <div className="p-4">Loading top books...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="bg-base-100 p-4 rounded-xl shadow mt-6">
      <h3 className="font-semibold mb-4">Top Performing Books</h3>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Downloads</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, index) => {
              const book = b.book;
              const coverSrc = book.coverImage
                ? `http://localhost:5001/${book.coverImage.replaceAll("\\", "/")}`
                : generateCover(book.title);

              return (
                <tr key={book._id || index}>
                  <td>
                    <img
                      src={coverSrc}
                      alt={book.title || "Untitled"}
                      className="w-10 h-14 object-cover rounded"
                    />
                  </td>
                  <td>{book.title || "Untitled"}</td>
                  <td>{b.downloads ?? 0}</td>
                  <td>⭐ {book.ratings?.toFixed(1) ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBooksTable;
