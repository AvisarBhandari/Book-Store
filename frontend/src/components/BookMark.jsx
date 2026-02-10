import { useEffect, useState } from "react";
import BookCard from "./bookCard.jsx";
import { getProfile } from "../utils/auth";
import { toast } from "react-hot-toast";

const BookMark = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      const profile = await getProfile();

      if (!profile?.user?._id) {
        toast.error("Please login to view bookmarks");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5001/api/user/${profile.user._id}/bookmarks`,
          { credentials: "include" },
        );

        const data = await res.json();
        setBooks(data.bookmarks || []);
      } catch (err) {
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  if (loading) return <p className="text-gray-400">Loading bookmarks...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">My Bookmarks </h1>

      {/* Empty state */}
      {books.length === 0 ? (
        <p className="text-gray-400">You haven’t bookmarked any books yet.</p>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {books.map((book) => (
            <BookCard key={book._id} bookId={book._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookMark;
