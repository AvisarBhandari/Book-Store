import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiStar } from "react-icons/fi"; // outlined star
import { FaStar } from "react-icons/fa"; // solid star
import { toast } from "react-hot-toast";

const BookSecond = ({ book }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [canReview, setCanReview] = useState(false); // <-- check if user can review

  const bookId = book?._id;

  /* ---------------- FETCH REVIEWS ---------------- */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5001/api/review/${bookId}?page=1&limit=5`,
        { withCredentials: true },
      );
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CHECK IF USER CAN REVIEW ---------------- */
  const checkReviewPermission = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/review/can-review/${bookId}`,
        { withCredentials: true },
      );
      setCanReview(res.data.canReview);
    } catch (err) {
      setCanReview(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchReviews();
      checkReviewPermission();
    }
  }, [bookId]);

  /* ---------------- RATING STATS ---------------- */
  const stats = useMemo(() => {
    if (!reviews.length) return { avg: 0, counts: {} };

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;

    reviews.forEach((r) => {
      counts[r.rating]++;
      total += r.rating;
    });

    return {
      avg: (total / reviews.length).toFixed(1),
      counts,
    };
  }, [reviews]);

  /* ---------------- SUBMIT REVIEW ---------------- */
  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please give rating & comment");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/review/set-review",
        {
          book: bookId,
          rating,
          comment,
        },
        { withCredentials: true },
      );

      toast.success(res.data?.message || "Review added");
      setRating(0);
      setComment("");
      fetchReviews();
      checkReviewPermission(); // refresh permission in case only 1 review allowed
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10 my-3 max-w-[87rem] mx-auto px-4">
      {/* LEFT – STATS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Customer reviews</h2>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl font-bold">{stats.avg}</span>
          <div>
            <div className="flex text-orange-400">
              {[...Array(5)].map((_, i) =>
                i < Math.round(stats.avg) ? (
                  <FaStar key={i} />
                ) : (
                  <FiStar key={i} />
                ),
              )}
            </div>
            <p className="text-sm text-gray-500">{reviews.length} Reviews</p>
          </div>
        </div>

        {/* Rating bars */}
        {[5, 4, 3, 2, 1].map((n) => (
          <div key={n} className="flex items-center gap-2 mb-2">
            <span className="text-sm w-4">{n}</span>
            <progress
              className="progress progress-primary w-full"
              value={stats.counts[n] || 0}
              max={reviews.length || 1}
            />
          </div>
        ))}
      </div>

      {/* RIGHT – REVIEWS */}
      <div className="lg:col-span-2">
        {/* WRITE REVIEW */}
        {canReview ? (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              How would you rate this book?
            </h3>

            <div className="flex gap-1 mb-2 text-orange-400 cursor-pointer">
              {[1, 2, 3, 4, 5].map((n) => (
                <FaStar
                  key={n}
                  size={20}
                  className={n <= rating ? "text-orange-400" : "text-gray-300"}
                  onClick={() => setRating(n)}
                />
              ))}
            </div>

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Write your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button onClick={submitReview} className="btn btn-primary mt-3">
              Submit review
            </button>
          </div>
        ) : (
          <p className="text-red-500 mb-6">
            You must purchase/read this book to leave a review.
          </p>
        )}

        {/* REVIEWS LIST */}
        {loading ? (
          <span className="loading loading-spinner" />
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="flex gap-4 mb-6">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                  <span>{r.user.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{r.user.name}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-orange-400 mb-1">
                  {[...Array(5)].map((_, i) =>
                    i < r.rating ? (
                      <FaStar key={i} size={14} />
                    ) : (
                      <FiStar key={i} size={14} />
                    ),
                  )}
                </div>

                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookSecond;
