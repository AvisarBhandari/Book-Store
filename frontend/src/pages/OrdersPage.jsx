import React, { useEffect, useState } from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/order/user/orders`, {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, authLoading, navigate]);

  const handleDownload = async (bookId, title) => {
    try {
      const res = await axios.get(`${API}/book/${bookId}/download`, {
        withCredentials: true,
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = (title || "book").replace(/[^a-z0-9.-]/gi, "_") + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Download failed");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow px-4 py-8 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-24 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">You have not purchased any books yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li
                key={o._id}
                className="flex flex-wrap items-center gap-4 p-4 bg-base-200 rounded-xl"
              >
                {o.book?.coverImage && (
                  <img
                    src={`http://localhost:5001/${o.book.coverImage}`}
                    alt=""
                    className="w-16 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold truncate">{o.book?.title}</h2>
                  <p className="text-sm text-gray-500">{o.book?.author}</p>
                  <p className="text-sm">Rs {Number(o.priceAtPurchase).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDownload(o.book?._id, o.book?.title)}
                  className="btn btn-primary btn-sm"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
