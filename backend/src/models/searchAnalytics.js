import mongoose from "mongoose";

const searchAnalyticsSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, index: true },

    normalizedQuery: { type: String, index: true },

    resultsCount: Number,

    impressions: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        rank: Number, // position in results
      },
    ],

    clickedBook: {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      rank: Number,
    },

    converted: { type: Boolean, default: false },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model("SearchAnalytics", searchAnalyticsSchema);
