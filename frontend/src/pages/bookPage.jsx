import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import BookFirst from "../components/book/Book-first.jsx";
import BookSecond from "../components/book/book-second.jsx";
import axios from "axios";

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/book/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading book...</p>
        ) : (
          <>
            <BookFirst book={book} />
            <BookSecond book={book} />
          </>
        )}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BookPage;
