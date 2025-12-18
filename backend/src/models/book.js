import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,

    price: Number,
    discountPercentage: Number,
    finalPrice: Number,

    genres: [String],

    coverImage: String,
    bookFile: String,

    soldCount: { type: Number, default: 0 },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null, // admin books for now
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // seller books later → pending
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
